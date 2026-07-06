"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MotionContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

/**
 * A safe wrapper for Framer Motion components to avoid 
 * hydration mismatches in Next.js SSR environment.
 */
export default function MotionContainer({ children, ...props }: MotionContainerProps) {
  const [mounted, setMounted] = useState(false);

  // We use this effect to ensure the component is only rendered 
  // on the client once hydration is complete.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={props.className}>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}
