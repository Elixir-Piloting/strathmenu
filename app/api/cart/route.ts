import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureCart(sessionId: string) {
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: { include: { menuItem: { include: { category: true } } } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: { items: { include: { menuItem: { include: { category: true } } } } },
    });
  }
  return cart;
}

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  if (!sessionId) return NextResponse.json([]);
  const cart = await ensureCart(sessionId);
  return NextResponse.json(cart.items.map((i) => ({ ...i.menuItem, cartItemId: i.id })));
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });
  const { menuItemId } = await request.json();
  if (!menuItemId) return NextResponse.json({ error: "menuItemId required" }, { status: 400 });
  const cart = await ensureCart(sessionId);
  const exists = cart.items.some((i) => i.menuItemId === menuItemId);
  if (!exists) {
    await prisma.cartItem.create({ data: { cartId: cart.id, menuItemId } });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });
  const { searchParams } = new URL(request.url);
  const menuItemId = searchParams.get("menuItemId");
  const cart = await ensureCart(sessionId);
  if (menuItemId) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, menuItemId } });
  } else {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return NextResponse.json({ success: true });
}
