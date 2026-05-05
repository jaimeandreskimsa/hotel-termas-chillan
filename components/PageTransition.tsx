"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionKey, setTransitionKey] = useState(0);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    setDisplayChildren(children);
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setTransitionKey(k => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div key={transitionKey} className="page-transition">
      {displayChildren}
    </div>
  );
}
