import React from "react";

interface ContentProps {
  children?: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <section className="flex-1 w-full min-h-0 overflow-hidden flex flex-col">
      {children}
    </section>
  );
}