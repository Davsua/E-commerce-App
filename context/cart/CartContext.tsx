import { ICartProduct, ShippingAddress } from '<@davsua>/interfaces';
import { createContext } from 'react';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;

  // methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;
  createOrder: () => Promise<void>;
}

export const CartContext = createContext({} as ContextProps);
