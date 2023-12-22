'use client';

import Button from '@/app/components/Button';
import ProductImage from '@/app/components/products/ProductImage';
import SetColor from '@/app/components/products/SetColor';
import SetQuantity from '@/app/components/products/SetQuantity';
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
  selectedImg: SelectedImgType;
  quantity: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
  size: string;
  price: number;
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
    selectedImg: {
      color: product?.colors[0].color,
      colorCode: product?.colors[0].colorCode,
      image: product?.colors[0].image,
      size: product?.colors[0]?.sizes[0]?.size,
      price: product?.colors[0].sizes[0]?.price,
      inventory: product?.colors[0].sizes[0]?.inventory,
    },
    quantity: 1,
  });
  const [productSize, setProductSize] = useState(cartProduct.selectedImg.size);

  const router = useRouter();

  const productRating =
    product?.reviews?.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product?.reviews?.length;

  const handleColorSelect = useCallback(
    (value: any) => {
      const { color, colorCode, image, sizes } = value;
      const result = sizes.filter(
        (item: any) => item.size === cartProduct.selectedImg.size
      );
      const { size, price, inventory } = result[0];
      console.log('ColorSelect', size, price, inventory);
      setCartProduct((prev) => {
        return {
          ...prev,
          selectedImg: { color, colorCode, image, size, price, inventory },
          quantity: 1,
        };
      });
    },
    [cartProduct]
  );

  const handleSizeSelect = useCallback((value: any) => {
    const { size, price, inventory } = value;
    setCartProduct((prev) => {
      return {
        ...prev,
        selectedImg: { ...prev.selectedImg, size, price, inventory },
      };
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity >= cartProduct.selectedImg.inventory) {
      return toast.error(
        `Sorry. We only have ${cartProduct.selectedImg.inventory} in stock.`
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

  console.log('CartProduct', cartProduct);

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
          {/* ========<<< Category >>>========================================= */}
          <div className='capitalize'>
            <span className='font-semibold'>category:</span>
            <span className='text-s font-normal ml-2'>{product?.category}</span>
          </div>
          {/* ========<<< Size >>>============================================ */}
          <div className='font-semibold capitalize'>
            size:
            <span className='font-normal ml-2'>
              {cartProduct.selectedImg.size === 'os'
                ? 'one-size'
                : cartProduct.selectedImg.size}
            </span>
            <div className='flex gap-1.5 mt-1'>
              {product?.colors
                .filter(
                  (item: any) => item.color === cartProduct.selectedImg.color
                )
                .map((colorItem: any) =>
                  colorItem.sizes.map((sizeItem: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleSizeSelect(sizeItem)}
                      className={`flex justify-center items-center uppercase border-[1px] rounded-full w-7  aspect-square text-xs cursor-pointer ${
                        cartProduct.selectedImg.size === sizeItem.size
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
              cartProduct.selectedImg.inventory > 5
                ? 'text-teal-400'
                : 'text-rose-400'
            }`}
          >
            {cartProduct.selectedImg.inventory > 5
              ? 'in stock'
              : cartProduct.selectedImg.inventory > 0
              ? `Only ${cartProduct.selectedImg.inventory} left in stock.`
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
                disabled={cartProduct.selectedImg.inventory < 1}
                label={
                  cartProduct.selectedImg.inventory < 1
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
