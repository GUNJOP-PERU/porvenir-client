import { motion, AnimatePresence } from "motion/react";

const SkeletonWrapper = ({ children, isLoading }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col gap-1 overflow-auto"
        >
          <div className="h-[40px] bg-zinc-200 animate-pulse rounded-lg w-full"></div>
          {Array.from({ length: 11 }).map((_, index) => (
            <motion.div
              key={index}
              className="h-[55px] bg-zinc-200 animate-pulse rounded-lg w-full"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
            ></motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkeletonWrapper;
