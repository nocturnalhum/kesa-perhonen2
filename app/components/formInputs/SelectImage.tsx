'use client';

import { useCallback } from 'react';
import { ImageType } from '@/app/admin/add-products/AddProductForm';
import { useDropzone } from 'react-dropzone';

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}

const SelectImage: React.FC<SelectImageProps> = ({
  item,
  handleFileChange,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'] },
  });

  return (
    <div
      {...getRootProps()}
      className='border-2 border-slate-200 p-2 border-dashed text-sm font-normal text-slate-400 flex items-center justify-center capitalize cursor-pointer'
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>+ {item?.color} Image</p>
      )}
    </div>
  );
};

export default SelectImage;
