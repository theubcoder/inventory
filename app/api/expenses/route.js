import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

    const where = {};
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    });

    const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    return NextResponse.json({ expenses, totalAmount });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, amount, description, date } = body;

    if (!category || !amount || !date) {
      return NextResponse.json({ error: 'Category, amount and date are required' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date)
      }
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, category, amount, description, date } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date)
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}