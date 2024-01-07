import { CiShoppingTag } from 'react-icons/ci';
import { GiPencil } from 'react-icons/gi';
import { GrNew } from 'react-icons/gr';
import { IoHomeOutline } from 'react-icons/io5';
import { LiaSocksSolid } from 'react-icons/lia';
import { PiBowlFoodLight } from 'react-icons/pi';
import { PiDressLight, PiShirtFoldedLight } from 'react-icons/pi';

export const categories = [
  {
    id: 0,
    category: 'sale',
    icon: CiShoppingTag,
    link: '',
  },
  {
    id: 1,
    category: 'new',
    icon: GrNew,
    link: '',
  },
  {
    id: 2,
    category: 'women',
    icon: PiDressLight,
    link: '',
  },
  {
    id: 3,
    category: 'men',
    icon: PiShirtFoldedLight,
    link: '',
  },
  {
    id: 4,
    category: 'shoes & accessories',
    icon: LiaSocksSolid,
    link: '',
  },
  {
    id: 5,
    category: 'home decor',
    icon: IoHomeOutline,
    link: '',
  },
  {
    id: 6,
    category: 'food',
    icon: PiBowlFoodLight,
    link: '',
  },
  {
    id: 7,
    category: 'stationery',
    icon: GiPencil,
    link: '',
  },
];
