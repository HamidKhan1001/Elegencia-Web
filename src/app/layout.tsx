import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elegancìa — The Water of Elites",
  description: "Pure. Pristine. Perfection. Glacial water filtered by nature, crafted for the elite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
