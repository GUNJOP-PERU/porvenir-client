import { cn } from "../lib/utils";

function SkeletonWrapper({ children, isLoading, fullWidth = true }) {
  if (!isLoading) return children;

  return (
    <div className={cn(fullWidth && "w-full h-full relative")}>
      <div className="absolute inset-0 bg-zinc-200 animate-pulse rounded-2xl">
        <div className="opacity-0">{children}</div>
      </div>
    </div>
  );
}

export default SkeletonWrapper;
