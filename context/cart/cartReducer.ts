import { ICartProduct, ShippingAddress } from '<@davsua>/interfaces';
import { CartState } from './';

type CartActionType =
  | { type: 'Cart - Load Cart From Cookies | storage'; payload: ICartProduct[] }
  | { type: 'Cart - Update cart'; payload: ICartProduct[] }
  | { type: 'Cart - Change cart product quantity'; payload: ICartProduct }
  | { type: 'Cart - Remove product in cart'; payload: ICartProduct }
  | { type: 'Cart - Load address from cookies'; payload: ShippingAddress }
  | { type: 'Cart - Update address'; payload: ShippingAddress }
  | {
      type: 'Cart - Update order summary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | { type: 'Cart . Order Complete' };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case 'Cart - Load Cart From Cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: action.payload,
      };

    case 'Cart - Update cart':
      return {
        ...state,
        cart: [...action.payload],
      };

    case 'Cart - Change cart product quantity':
      return {
        ...state,
        cart: state.cart.map((product) => {
          // si es diferente el id o el size, no sera el producto a actualizar
          if (product._id !== action.payload._id) return product;
          if (product._id !== action.payload.size) return product;

          // si pasa los dos filtros retornar el "nuevo" producto, con la nueva cantidad
          // -> es el mismo pdcto solo cambia la cantidad
          return action.payload;
        }),
      };

    case 'Cart - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            // ----------> si el producto coincide en id y size = false -> se eliminara
            !(product._id === action.payload._id && product.size === action.payload.size)
        ),
      };

    case 'Cart - Load address from cookies':
      return {
        ...state,
        shippingAddress: action.payload,
      };

    //Ambos haran lo mismo
    case 'Cart - Update address':
    case 'Cart - Update order summary':
      return {
        ...state,
        ...action.payload,
      };

    case 'Cart . Order Complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };

    default:
      return state;
  }
};
