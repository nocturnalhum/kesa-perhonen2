'use client';

import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import toast from 'react-hot-toast';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type CartContextType = {
  cartTotalQty: number;
  shoppingCart: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleClearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [shoppingCart, setShoppingCart] = useState<CartProductType[] | null>(
    null
  );

  // ==========================================================================
  // ========<<< Restore Shopping Cart from Local Storage >>>==================
  // ==========================================================================
  useEffect(() => {
    const cartItems: any = localStorage.getItem('shopCartItems');
    if (cartItems) {
      const shopLocalStore: CartProductType[] | null = JSON.parse(cartItems);
      setShoppingCart(shopLocalStore);
    }
  }, []);

  // ==========================================================================
  // ========<<< Handle Add Product to Cart >>>================================
  // ==========================================================================
  const handleAddProductToCart = useCallback((product: CartProductType) => {
    const cartProduct = {
      ...product,
      id: `${product.id}-${product.selectedItem.colorCode}-${product.selectedItem.size}`,
    };
    setShoppingCart((prev) => {
      let updatedCart;
      if (prev) {
        updatedCart = [...prev, cartProduct];
      } else {
        updatedCart = [cartProduct];
      }
      localStorage.setItem('shopCartItems', JSON.stringify(updatedCart));

      return updatedCart;
    });
    toast.success('Product added to cart');
  }, []);

  // ==========================================================================
  // ========<<< Handle Remmove Cart Product >>>===============================
  // ==========================================================================
  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (shoppingCart) {
        const filteredCartProducts = shoppingCart.filter(
          (item) =>
            item.id !== product.id ||
            item.selectedItem.color !== product.selectedItem.color
        );
        setShoppingCart(filteredCartProducts);
        toast.success('Product removed');
        localStorage.setItem(
          'shopCartItems',
          JSON.stringify(filteredCartProducts)
        );
      }
    },
    [shoppingCart]
  );

  // ==========================================================================
  // ========<<< Clear Cart >>>================================================
  // ==========================================================================
  const handleClearCart = useCallback(() => {
    setShoppingCart(null);
    setCartTotalQty(0);
    localStorage.setItem('shopCartItems', JSON.stringify(null));
  }, []);

  // ==========================================================================
  // ========<<< CartContextProvider Values >>>================================
  // ==========================================================================
  const value = {
    cartTotalQty,
    shoppingCart,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleClearCart,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
