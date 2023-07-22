import { db } from '<@davsua>/database';
import { Order, Product, User } from '<@davsua>/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();

  /*const numberOfOrders = await Order.count();
  const paidOrders = await Order.find({ isPaid: true }).count();
  const numberOfClients = await User.find({ role: 'client' }).count();
  const numberOfProducts = await Product.count();
  const productsWithNoInventory = await Order.find({ inStock: 0 }).count();
  const lowInventory = await Order.find({ inStock: { $lte: 10 } }).count();*/

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
}
