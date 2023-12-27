export const dynamic = 'force-dynamic';

export const revalidate = 0;

import { Metadata } from 'next';
import Container from './components/Container';
import HeroBanner from './components/HeroBanner';
import { products } from '@/utils/products';
import ProductCard from './components/products/ProductCard';

export const metadata: Metadata = {
  title: 'kesä perhonen | Home Goods | Apparel | Gifts Store',
};

export default function Home() {
  return (
    <div className='py-4 tablet:p-8'>
      <Container>
        <div>
          <HeroBanner />
        </div>
        <div className='grid grid-cols-2 gap-2 tablet:gap-8 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5'>
          {products.map((product) => {
            return (
              <div key={product.id} className='capitalize'>
                <ProductCard data={product} />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
