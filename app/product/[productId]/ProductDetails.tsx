'use client';

import Button from '@/app/components/Button';
import ProductImage from '@/app/components/products/ProductImage';
import SetColor from '@/app/components/products/SetColor';
import SetQuantity from '@/app/components/products/SetQuantity';
import { formatPrice } from '@/utils/formatPrice';
import { Rating, dividerClasses } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdArrowBack, MdCheckCircle } from 'react-icons/md';

interface ProductDetailsProps {
  product: any;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  selectedItem: SelectedItemType;
  quantity: number;
};

export type SelectedItemType = {
  color: string;
  colorCode: string;
  image: string;
  size: string;
  price: number;
  discount: number;
  inventory: number;
};

const Horizontal = () => {
  return <hr className='w-[30%] my-2' />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [isProductInCart, setIsProductInCart] = useState(false);

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product?.id,
    name: product?.name,
    description: product?.description,
    category: product?.category,
    selectedItem: {
      color: product?.colors[0].color,
      colorCode: product?.colors[0].colorCode,
      image: product?.colors[0].image,
      size: product?.colors[0]?.sizes[0]?.size,
      price: product?.colors[0].sizes[0]?.price,
      discount: product?.colors[0].sizes[0]?.discount,
      inventory: product?.colors[0].sizes[0]?.inventory,
    },
    quantity: 1,
  });

  const router = useRouter();

  const productRating =
    product?.reviews?.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product?.reviews?.length;

  const handleColorSelect = useCallback(
    (value: any) => {
      const { color, colorCode, image, sizes } = value;
      const result = sizes.filter(
        (item: any) => item.size === cartProduct.selectedItem.size
      );
      const { size, price, inventory, discount } = result[0];
      setCartProduct((prev) => {
        return {
          ...prev,
          selectedItem: {
            color,
            colorCode,
            image,
            size,
            price,
            discount,
            inventory,
          },
          quantity: 1,
        };
      });
    },
    [cartProduct]
  );

  const handleSizeSelect = useCallback((value: any) => {
    const { size, price, inventory, discount } = value;

    setCartProduct((prev) => {
      return {
        ...prev,
        selectedItem: {
          ...prev.selectedItem,
          size,
          price,
          discount,
          inventory,
        },
      };
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity >= cartProduct.selectedItem.inventory) {
      return toast.error(
        `Sorry. We only have ${cartProduct.selectedItem.inventory} in stock.`
      );
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        quantity: prev.quantity + 1,
      };
    });
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    setCartProduct((prev) => {
      return {
        ...prev,
        quantity: prev.quantity > 1 ? prev.quantity - 1 : prev.quantity,
      };
    });
  }, []);

  return (
    <div className='grid grid-cols-1 tablet:grid-cols-2 gap-12'>
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className='flex flex-col gap-1 text-slate-500 text-sm'>
        <h2 className='text-3xl font-medium to-sky-700 capitalize'>
          {product?.name}
        </h2>
        <div className='flex items-center gap-2'>
          <Rating value={productRating} precision={0.5} readOnly />
          <div>{product?.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className='text-justify'>{product?.description}</div>
        <Horizontal />
        <div className='space-y-3'>
          {/* ========<<< Price >>>========================================= */}
          <div className={`flex gap-4 font-bold text-lg text-slate-600`}>
            <div
              className={`${
                cartProduct.selectedItem.discount < 1 && 'line-through'
              }`}
            >
              {formatPrice(cartProduct.selectedItem.price)}
            </div>
            <div
              className={`${
                cartProduct.selectedItem.discount < 1
                  ? 'text-rose-500'
                  : 'hidden'
              }`}
            >
              {formatPrice(
                cartProduct.selectedItem.price *
                  cartProduct.selectedItem.discount
              )}
            </div>
          </div>
          {/* ========<<< Category >>>========================================= */}
          <div className='capitalize'>
            <span className='font-semibold'>category:</span>
            <span className='text-s font-normal ml-2'>{product?.category}</span>
          </div>
          {/* ========<<< Size >>>============================================ */}
          <div className='font-semibold capitalize'>
            size:
            <span className='font-normal uppercase ml-2'>
              {cartProduct.selectedItem.size === 'os'
                ? 'one-size'
                : cartProduct.selectedItem.size}
            </span>
            <div className='flex gap-1.5 mt-1'>
              {product?.colors
                .filter(
                  (item: any) => item.color === cartProduct.selectedItem.color
                )
                .map((colorItem: any) =>
                  colorItem.sizes.map((sizeItem: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleSizeSelect(sizeItem)}
                      className={`flex justify-center items-center uppercase border-[1px] rounded-full w-7  aspect-square text-xs cursor-pointer ${
                        cartProduct.selectedItem.size === sizeItem.size
                          ? 'border-slate-400'
                          : 'border-slate-200'
                      }`}
                    >
                      {sizeItem.size}
                    </div>
                  ))
                )}
            </div>
          </div>
          {/* ========<<< In Stock >>>========================================= */}
          <div
            className={`capitalize ${
              cartProduct.selectedItem.inventory > 5
                ? 'text-teal-400'
                : 'text-rose-400'
            }`}
          >
            {cartProduct.selectedItem.inventory > 5
              ? 'in stock'
              : cartProduct.selectedItem.inventory > 0
              ? `Only ${cartProduct.selectedItem.inventory} left in stock.`
              : 'out of stock'}
          </div>
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            {/* ========<<< Color >>>======================================== */}
            <div>
              <SetColor
                cartProduct={cartProduct}
                items={product?.colors}
                handleColorSelect={handleColorSelect}
              />
            </div>
            <Horizontal />
            <p className='mb-2 text-slate-500 flex items-center gap-1'>
              <MdCheckCircle size={20} className='text-teal-400' />
              <span>Product added to cart</span>
            </p>
            <div className='max-w-xs'>
              <Button
                label='View Cart'
                outline
                onClick={() => {
                  router.push('/cart');
                }}
              />
              <div
                onClick={() => router.back()}
                className='text-slate-500 flex items-center gap-1 mt-2 cursor-pointer'
              >
                <MdArrowBack />
                <span>Continue Shopping</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <SetColor
                cartProduct={cartProduct}
                items={product?.colors}
                handleColorSelect={handleColorSelect}
              />
            </div>
            <Horizontal />
            <div>
              <SetQuantity
                cartProduct={cartProduct}
                handleQtyIncrease={handleQtyIncrease}
                handleQtyDecrease={handleQtyDecrease}
              />
            </div>
            <Horizontal />
            <div className='max-w-xs'>
              <Button
                outline
                disabled={cartProduct.selectedItem.inventory < 1}
                label={
                  cartProduct.selectedItem.inventory < 1
                    ? 'Out of Stock'
                    : 'Add To Cart'
                }
                onClick={() => {}}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
