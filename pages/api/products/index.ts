import { db, SHOP_CONSTANTS } from '<@davsua>/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '<@davsua>/models';
import { Iproduct } from '../../../interfaces';

type Data = { message: string } | Iproduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }

  res.status(200).json({ message: 'Example' });
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;

  // sera el valor enviado a buscar en la base datos -> kid, men, etc..
  let condition = {};

  //si la persona ingreso algun valor cambiara de all a ese valor y ese valor
  // es igual que alguno de los que tenemos como validos en la base de datos...
  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }

  // si se le envia un valor que no este entre los valores definidos en la base de datos
  // traera todos lops productos --> gender = all

  await db.connect();

  const products = await Product.find(condition).select('title images price inStock slug -_id').lean();
  // 1. si al find no se le manda nada, trae TODO
  // 2. select es para escoger los campos que quiero traer solamente
  //si se pone un - significa que no quiero esa columna

  await db.disconnect();

  /*-------------------------
      permitir leer imagene de FileSystem y cloudinary
  --------------------------*/

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes('http') ? img : `${process.env.HOST_NAME}products/${img}`;
    });

    return product;
  });

  return res.status(200).json(updatedProducts);
};
