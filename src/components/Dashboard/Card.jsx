function CardItem({ value, title, change, valueColor,unid }) {
    return (
      <div className="flex flex-col justify-center ">
        <div className="flex justify-between gap-1">
          <h1 className={`${valueColor} font-extrabold text-2xl leading-8`}>
            {value}<small>{unid}</small>
          </h1>
        </div>
        <span className="text-[10px] font-semibold text-zinc-700">{title}</span>
        <div className="mt-2 flex items-center">
          <span className="text-[10px] text-zinc-400 leading-[8px]">{change}</span>
        </div>
      </div>
    );
  }
  
  export default CardItem;
  