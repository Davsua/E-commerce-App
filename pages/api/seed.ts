import type { NextApiRequest, NextApiResponse } from 'next';

import { Order, Product, User } from '<@davsua>/models';
import { db, seedDatabase } from '<@davsua>/database';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  //Si esta en produccion...
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tienes acceso a este servicio' });
  }

  await db.connect();
  //desde aqui puedo hacer cualquier interaccion con la base de datos

  await User.deleteMany();
  await User.insertMany(seedDatabase.initialData.users);

  //si no pongo nada entr () elimino/agrego TODO
  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);

  await Order.deleteMany();

  //Hasta aqui es la interaccion con la base de datos
  await db.disconnect();

  res.status(200).json({ message: 'Proceso realizado correctamente' });
}
