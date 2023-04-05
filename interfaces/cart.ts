import { ISize } from './';

export interface ICartProduct {
  _id: string;
  image: string;
  price: number;
  size?: ISize;
  slug: string;
  title: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  quantity: number;
}

export interface ICartProductItem {
  _id: string;
  quantity: number;
}
