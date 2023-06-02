import { IOrder } from '<@davsua>/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db, dbProducts } from '<@davsua>/database';
import { Order, Product } from '<@davsua>/models';

type Data = { message: string } | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
      break;
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // verificar que exista un usuario

  //const session: any = await getSession({ req });
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }

  console.log(session);

  // Crear un arreglo con los productos que la persona quiere
  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  // Encontrar pdctos que estan en el carrito en la BD
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      // si el id no coincide -> no encuentra precio; puede ocurrir por manipulacion del usuario a los pdctos
      const currentPrice = dbProducts.find((prod) => prod.id === current._id)?.price;
      if (!currentPrice) {
        throw new Error('Verifique el carrito de nuevo, producto no existe');
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = Number((subTotal * (taxRate + 1)).toFixed(2));

    if (total !== backendTotal) {
      throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    console.log(session.user);
    const userId = session.user._id;
    console.log(userId);

    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    //convertir a solos dos decimales
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();

    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || 'Revise logs del servidor',
    });
  }

  // return res.status(201).json( req.body );
};
