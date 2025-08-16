import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    
    return Response.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const supplier = await prisma.supplier.create({
      data: {
        name: body.name,
        contactNumber: body.contactNumber,
        address: body.address
      }
    });
    
    return Response.json(supplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    return Response.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}