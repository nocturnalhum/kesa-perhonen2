'use client';

import { IconType } from 'react-icons';

interface CategoryInputProps {
  selected?: boolean;
  category: string;
  icon: IconType;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  selected,
  category,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(category)}
      className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 capitalize hover:border-slate-400 transition cursor-pointer ${
        selected
          ? 'border-slate-500 hover:border-slate-600 bg-slate-200/50'
          : 'border-slate-200'
      }`}
    >
      <Icon size={25} />
      <div className='font-light text-sm'>{category}</div>
    </div>
  );
};

export default CategoryInput;
