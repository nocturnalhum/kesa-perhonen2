import { getCurrentUser } from '@/actions/getCurrentUser';
import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import Stripe from 'stripe';
import { NextApiRequest } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal =
      item.selectedItem.price * item.quantity * item.selectedItem.discount;
    return acc + itemTotal;
  }, 0);
  return Math.fround(totalPrice * 100);
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();

  const { items, payment_intent_id } = body;
  const totalAmount = calculateOrderAmount(items);
  // MongoDB object:
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: totalAmount,
    currency: 'cad',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: totalAmount }
      );
      // update order
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount: totalAmount,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json(
          { error: 'Invalid Payment Intent' },
          { status: 400 }
        );
      }
      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // Create New Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
    });
    // Create the Order
    orderData.paymentIntentId = paymentIntent.id;
    await prisma.order.create({
      data: orderData,
    });
    return NextResponse.json({ paymentIntent });
  }
}
