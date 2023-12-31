'use client';

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Button from '../components/formInputs/Button';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const { shoppingCart, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (shoppingCart) {
        setLoading(true);
        setError(false);

        try {
          const res = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: shoppingCart,
              payment_intent_id: paymentIntent,
            }),
          });

          setLoading(false);

          if (res.status === 401) {
            return router.push('/login');
          }

          const data = await res.json();
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        } catch (error) {
          setError(true);
          console.error('Error in CheckoutClient: ', error);
          toast.error('Error in CheckoutClient');
        }
      }
    };

    fetchData();
  }, [shoppingCart, paymentIntent, router, handleSetPaymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className='w-full'>
      {clientSecret && shoppingCart && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className='text-center'>Loading Checkout</div>}
      {error && (
        <div className='text-center text-rose-500'>
          Something whent wrong...
        </div>
      )}
      {paymentSuccess && (
        <div className='flex items-center flex-col gap-4'>
          <div className='text-center text-teal-500'>Payment Success</div>
          <div className='w-full max-w-[220px]'>
            <Button
              label='View Your Orders'
              onClick={() => router.push('/order')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
