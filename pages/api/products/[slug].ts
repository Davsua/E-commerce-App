import { db } from '<@davsua>/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '<@davsua>/models';
import { Iproduct } from '../../../interfaces';

type Data = { message: string } | Iproduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }

  res.status(200).json({ message: 'Example' });
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const { slug } = req.query;

  // find or findOne siempore reciben en object
  const productBySlug = await Product.findOne({ slug }).lean();

  await db.disconnect();

  if (!productBySlug) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  productBySlug.images = productBySlug.images.map((img) => {
    return img.includes('http') ? img : `${process.env.HOST_NAME}products/${img}`;
  });

  return res.status(200).json(productBySlug);
};
