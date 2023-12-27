export const dynamic = 'force-dynamic';

import Container from '../components/Container';
import CartClient from './CartClient';

const Cart = async () => {
  return (
    <div className='pt-8'>
      <Container>
        <CartClient />
      </Container>
    </div>
  );
};

export default Cart;
