import type { NextApiRequest, NextApiResponse } from 'next';
import { Iproduct } from '../../../interfaces/products';
import { db } from '<@davsua>/database';
import { Product } from '<@davsua>/models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
// autenticacion de clodinary con la llave sexreta y publica proporcionada por cloudinary
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string } | Iproduct[] | Iproduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    case 'PUT':
      return updateProduct(req, res);

    case 'POST':
      return createProduct(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find().sort({ title: 'asc' }).lean();

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

  res.status(200).json(updatedProducts);
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as Iproduct;

  //console.log(req.body);

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del producto no es valido' });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: 'Es necesario almenos 2 imagenes' });
  }

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese ID' });
    }

    /*------------
     Eliminar fotos en cloudinary
     -------------*/
    //--> url format: https://res.cloudinary.com/dckfxijf4/image/upload/v1689731011/rguokonpqjc2ux1ewxbb.webp

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        //eliminar de cloudinary
        const fileExt = image.split('/').pop();
        //tomar el id
        const extension = fileExt?.split('.').shift();
        //console.log({ image, fileExt, extension });
        await cloudinary.uploader.destroy(extension!);
      }
    });

    await product.updateOne(req.body);

    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.json({ message: 'Revisar consola del servidor' });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as Iproduct;

  if (images.length < 2) {
    return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' });
  }

  try {
    await db.connect();

    // Buscar si ya existe ese producto
    const productInDB = await Product.findOne({ slug: req.body.slug });

    if (productInDB) {
      return res.status(400).json({ message: 'Ya existe un producto con este slug' });
    }

    // crear producto
    const product = new Product(req.body);

    await product.save();

    res.status(201).json(product);

    await db.disconnect();
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};
