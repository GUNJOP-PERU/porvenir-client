import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { memo, useMemo } from "react";

const AnimatedContainer = memo(({ isLoading, children, className }) => {
  const content = useMemo(() => {
    return (
      <m.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${className}`}
      >
        {children}
      </m.div>
    );
  }, [children, className]);

  return (
    <AnimatePresence>
        <LazyMotion features={domAnimation}>
      {isLoading ? (
        <m.div
          key="loading"
          className="bg-zinc-200/50 w-full h-full rounded-2xl relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        content
      )}
      </LazyMotion>
    </AnimatePresence>
  );
});

export default AnimatedContainer;
