'use client';

import { ImageType } from '@/app/admin/add-products/AddProductForm';
import { ReactHTMLElement, useCallback, useEffect, useState } from 'react';
import SelectImage from './SelectImage';
import Button from './Button';
import { truncateText } from '@/utils/truncateText';

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback((value: File) => {
    setFile(value);
    addImageToState({ ...item, image: value });
  }, []);

  const handleCheck = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(event.target.checked);
      if (!event.target.checked) {
        setFile(null);
        removeImageFromState(item);
      }
    },
    []
  );
  return (
    <div className='grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 p-2'>
      <div className='flex flex-row gap-2 items-center h-[60px]'>
        <input
          id={item.color}
          type='checkbox'
          checked={isSelected}
          onChange={handleCheck}
          className='cursor-pointer'
        />
        <label
          htmlFor={item.color}
          className='font-light text-sm capitalize cursor-pointer'
        >
          {item.color}
        </label>
      </div>
      <>
        {isSelected && !file && (
          <div className='col-span-2 text-center h-full'>
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {file && (
          <div className='flex flex-row w-full gap-2 text-sm col-span-2 items-center justify-between'>
            <p>{truncateText(file?.name)}</p>
            <div className=''>
              <Button
                label='Cancel'
                small
                outline
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectColor;
