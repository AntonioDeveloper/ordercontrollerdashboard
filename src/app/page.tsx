import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import Content from "@/components/ui/content";

export default function Home() {
  return (
    <div className="w-screen h-dvh bg-slate-800 flex flex-col justify-between">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
