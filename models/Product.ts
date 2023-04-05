import { Iproduct } from '<@davsua>/interfaces';
import mongoose, { model, Schema, Model } from 'mongoose';

{
  /* crear esquema -> como luce el modelo*/
}
const productSchema = new Schema(
  {
    description: { type: String, required: true },
    images: [{ type: String }], // [{}] -> en array
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        // ponerle valores 'unicos'
        enum: {
          values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
          message: '{VALUE} no es un tamaño permitido',
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true },
    type: {
      type: String,
      enum: {
        values: ['shirts', 'pants', 'hoodies', 'hats'],
        message: '{VALUE} no es un tipo de prenda permitido',
      },
    },
    gender: {
      type: String,
      enum: {
        values: ['men', 'women', 'kid', 'unisex'],
        message: '{VALUE} no es un genero valido',
      },
    },
  },
  {
    timestamps: true, // crea el createdAt y cuando se actualice de manera automatica
  }
);

// indice de mongo -> encuentra el indice de la propiedad que le pida
productSchema.index({ title: 'text', tags: 'text' });

// crear modelo en base a la interface; si existe tomarlo || si no existe crearlo (nombre, a donde apunta)
const Product: Model<Iproduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;
