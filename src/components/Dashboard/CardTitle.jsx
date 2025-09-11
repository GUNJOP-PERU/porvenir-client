import React from "react";

const CardTitle = React.memo(
  ({ title, subtitle, icon: Icon, classIcon, children, className }) => {
    return (
      <div
        className={`flex flex-col border border-[#F0F0F0] shadow-sm rounded-xl p-3 ${className}`}
      >
        <div className="w-full flex flex-col gap-1 border-b border-zinc-100 pb-2">
          <div className="flex items-end gap-2">
            {Icon && <Icon className={`w-4 h-4 ${classIcon}`} />}
            <h4 className="text-xs font-bold leading-3">{title}</h4>
          </div>
          <p className="text-[10.5px] text-zinc-400 leading-3">{subtitle}</p>
        </div>
        {children}
      </div>
    );
  }
);

CardTitle.displayName = "CardTitle";
export default CardTitle;
