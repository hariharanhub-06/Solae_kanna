import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-10 xl:px-14 ${className}`}>
      {children}
    </div>
  );
}
