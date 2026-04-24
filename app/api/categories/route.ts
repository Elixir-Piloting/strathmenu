import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const categories = await prisma.category.findMany({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: { name: "asc" },
    take: 10,
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const category = await prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });

  return NextResponse.json(category, { status: 201 });
}