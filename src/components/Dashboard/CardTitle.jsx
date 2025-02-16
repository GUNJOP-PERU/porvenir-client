import IconDash1 from "@/icons/Dashboard/IconDash1";
import React from "react";

const CardTitle = React.memo(({ title, subtitle, icon: Icon }) => {
  return (
    <>
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-end gap-2">
          {Icon && <IconDash1 className="text-zinc-500 w-4 h-4" />}
          <h4 className="text-xs font-bold leading-3">{title}</h4>
        </div>
        <p className="text-[10.5px] text-zinc-400 leading-3">{subtitle}</p>
      </div>
      <div className="w-full h-[1px] bg-zinc-100 mt-1"></div>
    </>
  );
});

CardTitle.displayName = "CardTitle";
export default CardTitle;
