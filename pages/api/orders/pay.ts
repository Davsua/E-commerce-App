import { db } from '<@davsua>/database';
import { Ipaypal } from '<@davsua>/interfaces';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { disconnect } from '../../../database/db';
import { Order } from '<@davsua>/models';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  // creacion de token
  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

  const body = new URLSearchParams('grant_type=client_credentials'); // base64

  try {
    //peticion para generar el auth token --> permite que si hay un fallo (se va el internet, no habia cupo suficiente) el
    //usuario pueda pagar la orden sin necesidad de hacer todo el proceso de nuevo
    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: {
        Authorization: `Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded', // -> postman: https://prnt.sc/aHGLY0HRqGNx
      },
    });

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }

    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Obtener token de validaciond desde el backend
  const paypalBearerToken = await getPayPalBearerToken();

  if (!paypalBearerToken) {
    return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' });
  }

  // id de la orden paypal , id orden mongo
  const { transactionId = '', orderId = '' } = req.body; // Postman ejm =>  https://prnt.sc/3a22IoTSEUgD

  const { data } = await axios.get<Ipaypal.PayPalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      //Autorizacion por token
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );

  if (data.status !== 'COMPLETED') {
    return res.status(401).json({ message: 'Orden no rconocida' });
  }

  await db.connect();

  const dbOrder = await Order.findById(orderId);

  if (!dbOrder) {
    await db.disconnect();
    return res.status(400).json({ message: 'Orden no existe en base de datos' });
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res.status(400).json({ message: 'Los valores de paypal y nuestro NO son iguales' });
  }

  // Almacenar en nuestra base de datos el id de la transaccion de paypal (ayuda confirmar datos.. etc)
  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;
  dbOrder.save();

  await db.disconnect();

  return res.status(200).json({ message: 'Orden Pagada' });
};
