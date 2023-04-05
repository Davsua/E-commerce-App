import { Iproduct } from './../../../interfaces/products';
import { db } from '<@davsua>/database';
import { Product } from '<@davsua>/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | Iproduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  let { query = '' } = req.query;

  if (query.length === 0) {
    return res.status(400).json({ message: 'Debe ingresar un query de busqueda' });
  }

  query = query.toString().toLowerCase();

  await db.connect();

  const products = await Product.find({
    //buscara en el index de cada elemento segun el tipo (text) buscando el query en este caso
    // el tipo fue asignado en models/Product y busca en title y tags
    $text: { $search: query },
  })
    .select('title images price inStock -_id')
    .lean();

  await db.disconnect();

  return res.status(200).json(products);
};
