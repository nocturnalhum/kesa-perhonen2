import bcrypt from 'bcrypt';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.error();
  }
  const body = await request.json();
  console.log('BODY', body);
  const { name, description, category, isNew, images } = body;

  const product = await prisma.product.create({
    data: { name, description, category, isNew, items: images },
  });

  return NextResponse.json(product);
}
