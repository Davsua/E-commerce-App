import { useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct } from '<@davsua>/interfaces';
import { CartContext, cartReducer } from './';
//definir estado de la aplicacion

type Props = {
  children?: React.ReactNode;
};

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined, // inicia como undefined por que se cargara de las cookies
};
export const CartProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  /**
   * ---> obtener de cookies
   **/
  useEffect(() => {
    //try catch por si no se lee la cookie adecuadamente
    try {
      const cartFromCookies = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: 'Cart - Load Cart From Cookies | storage', payload: cartFromCookies });
    } catch (error) {
      dispatch({ type: 'Cart - Load Cart From Cookies | storage', payload: [] });
    }
  }, []);

  /**
   * Cargar la info de entrega
   * en el contexto
   */

  useEffect(() => {
    //Validar que haya informacion guardad
    //¿por que solo first name?
    //Porque si se llena uno, el resto de campo son obligatorios
    if (Cookie.get('firstName')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('laslastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      };
      dispatch({ type: 'Cart - Load address from cookies', payload: shippingAddress });
    }
  }, []);

  /**
   * ---> Almacenar en cookies
   * se disparara cada que hay un cambio en el carrito
   * cada wue se dispare se actualizan las cookies
   * */

  useEffect(() => {
    if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  /**
   * ---> manejo de n° items, subtotal a pagar y los impuestos
   */

  useEffect(() => {
    // 0 => valor inicial de prev
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
    // Se guarda el % en variable de entorno para que sea facil de modificar en el futuro
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: Number((subTotal * (taxRate + 1)).toFixed(2)),
    };

    dispatch({ type: 'Cart - Update order summary', payload: orderSummary });
    //console.log(orderSummary);
  }, [state.cart]);

  /**
   * --> añadir pdcto al carrito
   **/

  const addProductToCart = (product: ICartProduct) => {
    // verificar si existe producto con ese ID
    const productInCart = state.cart.some((p) => p._id === product._id);

    //si no existe agregarlo
    if (!productInCart) return dispatch({ type: 'Cart - Update cart', payload: [...state.cart, product] });

    // mismo producto con diferente talla
    const productInCartWDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartWDifferentSize)
      return dispatch({ type: 'Cart - Update cart', payload: [...state.cart, product] });

    // si existe el producto y tiene la misma talla q otro --> acumular
    const updateProduct = state.cart.map((p) => {
      // filtrar los que no sean el mismo producto
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      //actualizar
      p.quantity += product.quantity;

      return p;
    });

    dispatch({ type: 'Cart - Update cart', payload: updateProduct });
  };

  // --> Actualizar el numero de prendas desde el carrito

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: 'Cart - Change cart product quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: 'Cart - Remove product in cart', payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    //Guardar en cookies
    Cookie.set('firstName', address.firstName);
    Cookie.set('laslastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({ type: 'Cart - Update address', payload: address });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
