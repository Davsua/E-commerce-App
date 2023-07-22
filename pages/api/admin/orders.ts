import { db } from '<@davsua>/database';
import { IOrder } from '<@davsua>/interfaces';
import { Order } from '<@davsua>/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | IOrder[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getOrders(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const orders = await Order.find()
    .sort({ createdAt: 'desc' }) // desc = descendente
    .populate('user', 'name email') // llenar con info que necesito (en este caso el usuario dueño de la orden)
    .lean();

  await db.disconnect();

  return res.status(200).json(orders);
};
