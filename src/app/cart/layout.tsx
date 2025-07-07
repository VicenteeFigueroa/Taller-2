import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Carrito - BLACKCAT",
  description: "Revisa y gestiona los productos en tu carrito de compras",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
