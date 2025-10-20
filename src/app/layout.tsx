import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/components/ui/menu";
import Content from "@/components/ui/content";
import Footer from "@/components/ui/footer";
import { OrdersProvider } from "@/context/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaDash",
  description: "Painel de clientes e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <OrdersProvider>
          <main className="w-screen h-dvh bg-slate-800 flex">
            <Menu />
            <div className="flex-1 h-screen flex flex-col justify-between">
              <Content>{children}</Content>
              <Footer />
            </div>
          </main>
        </OrdersProvider>
      </body>
    </html>
  );
}
