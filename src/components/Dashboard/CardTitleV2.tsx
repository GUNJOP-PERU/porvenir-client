import { memo } from "react";

interface CardTitleProps {
  title: string;
  subtitle?: string;
  icon?: any;
  classIcon?: string;
  children?: React.ReactNode;
  className?: string;
  actions?: JSX.Element;
}

const CardTitle = memo(
  ({ title, subtitle, icon: Icon, classIcon, children, className, actions } : CardTitleProps) => {
    return (
      <div
        className={`flex flex-col border border-zinc-100 shadow-sm rounded-xl p-3 ${className}`}
      >
        <div className="w-full flex items-center gap-1.5 border-b border-zinc-100 pb-2 mb-2">
          <div className="flex items-center justify-center ">{Icon && <Icon className={`size-[17px] ${classIcon}`} />}</div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold leading-3">{title}</h4>
            <p className="text-[10.5px] text-zinc-400 leading-3">{subtitle}</p>
          </div>
          {actions && 
            <div className="ml-auto">
              {actions}
            </div>
          }
        </div>
        {children}
      </div>
    );
  }
);

export default CardTitle;
