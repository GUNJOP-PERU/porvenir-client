const SkeletonWrapper = ({ children, isLoading }) => {
  return (
    <div className="relative flex-1 overflow-auto">
      {isLoading ? (
        <div className="flex flex-col gap-1 animate-fade-in">
         <div className="w-full flex justify-between mb-4 gap-2">
         <div className="h-[34px] w-full md:w-[250px] bg-zinc-200 animate-pulse rounded-lg "></div>
         <div className="h-[34px] w-[94px] bg-zinc-200 animate-pulse rounded-lg  "></div>
         </div>
         
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              key={index}
              className="h-[55px] bg-zinc-200 animate-pulse rounded-lg w-full"
            
            ></div>
          ))}
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100">{children}</div>
      )}
    </div>
  );
};

export default SkeletonWrapper;