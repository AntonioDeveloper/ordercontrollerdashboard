import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/components/ui/menu";
import Content from "@/components/ui/content";
import Footer from "@/components/ui/footer";
import BottomMenu from "@/components/ui/bottomMenu";
import SignUpManager from "@/components/ui/signUpManager";
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
          <main className="w-screen h-screen bg-slate-800 flex flex-col md:flex-row overflow-hidden">
            <Menu />
            <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#F9F9F9]">
              <Content>{children}</Content>
              <div className="md:hidden">
                 <BottomMenu />
              </div>
              <div className="hidden md:block">
                 <Footer />
              </div>
            </div>
            <SignUpManager />
          </main>
        </OrdersProvider>
      </body>
    </html>
  );
}
