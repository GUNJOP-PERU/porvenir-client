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
          className="flex-1 overflow-auto"
        >
          {/* <div className="h-[34px] bg-zinc-200 animate-pulse rounded-lg w-full mb-2"></div> */}
          <table className="min-w-full table-auto">
            {/* Encabezado */}
            <thead className="h-10">
              <tr>
                {Array.from({ length: 10 }).map((_, index) => (
                  <th key={index} className="px-0.5 h-[40px]">
                    <motion.div
                      className="h-[40px] bg-zinc-200 animate-pulse rounded-lg w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Filas de carga */}
            <tbody>
              {Array.from({ length: 11 }).map((_, index) => (
                <motion.tr
                  key={index}
                  className="h-[60px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.1, delay: index * 0.03 }}
                >
                  <td colSpan={10} className="px-1">
                    <motion.div
                      className="h-[55px] bg-zinc-200 animate-pulse rounded-lg w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1, delay: index * 0.03 }}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
