import { db } from '<@davsua>/database';
import { Iproduct } from '<@davsua>/interfaces';
import { Product } from '<@davsua>/models';

export const getProductBySlug = async (slug: string): Promise<Iproduct | null> => {
  await db.connect();

  const product = await Product.findOne({ slug }).lean();

  await db.disconnect();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
};

// obtener todos los slugs para porder usarlos de manera estatica

interface ProductSlug {
  slug: string;
}

export const getAllProductsSlug = async (): Promise<ProductSlug[]> => {
  await db.connect();

  const slugs = await Product.find().select('slug -_id').lean();

  await db.disconnect();

  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<Iproduct[]> => {
  term = term.toString().toLowerCase();

  await db.connect();

  const products = await Product.find({
    //buscara en el index de cada elemento segun el tipo (text) buscando el query en este caso
    // el tipo fue asignado en models/Product y busca en title y tags
    $text: { $search: term },
  })
    .select('title images price inStock -_id')
    .lean();

  await db.disconnect();

  return products;
};

export const getAllProducts = async (): Promise<Iproduct[]> => {
  await db.connect();

  const products = await Product.find().lean();

  await db.disconnect();

  //serializar las dates y el id
  return JSON.parse(JSON.stringify(products));
};
