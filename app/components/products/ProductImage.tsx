'use client';
import {
  CartProductType,
  SelectedItemType,
} from '@/app/product/[productId]/ProductDetails';
import Image from 'next/image';
import React from 'react';

interface ProductImageProps {
  cartProduct: CartProductType;
  product: any;
  handleColorSelect: (value: SelectedItemType) => void;
}
const ProductImage: React.FC<ProductImageProps> = ({
  cartProduct,
  product,
  handleColorSelect,
}) => {
  return (
    <div className='grid grid-cols-6 gap-2 h-full'>
      <div className='border cursor-pointer h-fit'>
        <div className='flex flex-col items-center'>
          {/* Map out different colors of item */}
          {product?.colors.map((image: SelectedItemType) => {
            return (
              <div
                key={image.color}
                onClick={() => handleColorSelect(image)}
                className={`relative w-[80%] aspect-square rounded border-teal-300 my-2 ${
                  cartProduct.selectedItem?.color === image.color
                    ? 'border-[1.5px]'
                    : 'border-none'
                }`}
              >
                {/* =====< Sidebar with different color variations of item >>>=====*/}
                <Image
                  src={image.image}
                  alt={image.color}
                  height={800}
                  width={600}
                  className='object-contain'
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className='col-span-5 aspect-square'>
        {/* =====<<< Display large color image of item selected for adding to cart >>>=====*/}
        <Image
          src={cartProduct.selectedItem.image}
          alt={cartProduct.name + ' ' + cartProduct.selectedItem.color}
          height={800}
          width={600}
          className='w-full h-full object-contain'
        />
      </div>
    </div>
  );
};

export default ProductImage;
