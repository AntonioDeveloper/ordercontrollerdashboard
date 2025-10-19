import React from "react";

interface ContentProps {
  children?: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <section className="w-full h-full bg-slate-100 p-4 overflow-auto">
      {children}
    </section>
  );
}