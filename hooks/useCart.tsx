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
  cartTotalAmount: number;
  shoppingCart: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [shoppingCart, setShoppingCart] = useState<CartProductType[] | null>(
    null
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // ==========================================================================
  // ========<<< Restore Shopping Cart from Local Storage >>>==================
  // ==========================================================================

  useEffect(() => {
    const cartItems: any = localStorage.getItem('shopCartItems');
    if (cartItems) {
      const shopLocalStore: CartProductType[] | null = JSON.parse(cartItems);
      setShoppingCart(shopLocalStore);
    }
    const shopPaymentIntent: any = localStorage.getItem('shopPaymentIntent');
    const paymentIntent: string | null = JSON.parse(shopPaymentIntent);
    setPaymentIntent(paymentIntent);
  }, []);

  // ==========================================================================
  // ========<<< Update Shopping Cart Subtotal >>>=============================
  // ==========================================================================
  useEffect(() => {
    const getTotals = () => {
      if (shoppingCart) {
        const { total, qty } = shoppingCart?.reduce(
          (acc, item) => {
            const itemTotal =
              item.selectedItem.price *
              item.selectedItem.discount *
              item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotals();
  }, [shoppingCart]);

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
  // ========<<< Handle Cart Qty Increase >>>==================================
  // ==========================================================================
  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity >= product.selectedItem.inventory) {
        return toast.error(
          `Sorry. We only have ${product.selectedItem.inventory} in stock.`
        );
      }

      if (shoppingCart) {
        updatedCart = [...shoppingCart];
        const existingIndex = shoppingCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          ++updatedCart[existingIndex].quantity;
        }
        setShoppingCart(updatedCart);
        localStorage.setItem('shopCartItems', JSON.stringify(updatedCart));
      }
    },
    [shoppingCart]
  );

  // ==========================================================================
  // ========<<< Handle Cart Qty Decrease >>>==================================
  // ==========================================================================
  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity <= 1) {
        return toast.error("Click 'Remove' to remove product.");
      }

      if (shoppingCart) {
        updatedCart = [...shoppingCart];

        const existingIndex = shoppingCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          --updatedCart[existingIndex].quantity;
        }
        setShoppingCart(updatedCart);
        localStorage.setItem('shopCartItems', JSON.stringify(updatedCart));
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
  // ========<<< Handle Set Payment Intent >>>=================================
  // ==========================================================================

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem('shopPaymentIntent', JSON.stringify(val));
  }, []);

  // ==========================================================================
  // ========<<< CartContextProvider Values >>>================================
  // ==========================================================================

  const value = {
    cartTotalQty,
    cartTotalAmount,
    shoppingCart,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
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
