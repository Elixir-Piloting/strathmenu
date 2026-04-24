import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryName = searchParams.get("category");
  const day = searchParams.get("day");
  const location = searchParams.get("location");

  const items = await prisma.menuItem.findMany({
    where: {
      ...(categoryName && { category: { name: categoryName } }),
      ...(day && { day }),
      ...(location && { location }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, categoryId, categoryName, day, mealPeriod, location, imageUrl } = body;

  let finalCategoryId = categoryId;

  if (!finalCategoryId && categoryName) {
    const existing = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (existing) {
      finalCategoryId = existing.id;
    } else {
      const newCategory = await prisma.category.create({
        data: { name: categoryName },
      });
      finalCategoryId = newCategory.id;
    }
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      price: parseFloat(price),
      categoryId: finalCategoryId,
      day: day || null,
      mealPeriod: mealPeriod || null,
      location: location || null,
      imageUrl: imageUrl || null,
    },
    include: { category: true },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, name, price, categoryId, categoryName, day, mealPeriod, location, imageUrl } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  let finalCategoryId = categoryId;

  if (!finalCategoryId && categoryName) {
    const existing = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (existing) {
      finalCategoryId = existing.id;
    } else {
      const newCategory = await prisma.category.create({
        data: { name: categoryName },
      });
      finalCategoryId = newCategory.id;
    }
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      price: parseFloat(price),
      categoryId: finalCategoryId,
      day: day || null,
      mealPeriod: mealPeriod || null,
      location: location || null,
      imageUrl: imageUrl || null,
    },
    include: { category: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await prisma.menuItem.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}