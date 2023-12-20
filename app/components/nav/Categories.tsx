import { categories } from '@/utils/categories';
import React from 'react';
import { GoChevronDown } from 'react-icons/go';

const Categories = () => {
  return (
    <div className='w-fit mx-auto p-6 hidden capitalize laptop:flex justify-between'>
      <div
        className={`flex flex-wrap gap-[1.6rem] items-center leading-4 tracking-[0.01em] text-neutral-800 font-normal`}
      >
        {categories.map((item) => {
          return (
            <div
              key={item.id}
              className={`flex items-center justify-center ${
                item.category === 'sale' && 'text-[#7f0019] font-bold'
              }`}
            >
              {item.category}
              <GoChevronDown size={14} className='mt-1 ml-0.5' />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
