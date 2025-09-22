import CardItem from "../CardItem";

export default function KPITimeDistribution({ data, isLoading }) {

  const cardData = [
    {
      value: data ? Number(data.avg_time_cycle_min) : undefined,
      title: "Tiempo Prom. / Ciclo",
      valueColor: "text-sky-500",
      unid: "min",
      decimals: 2,
    },   
    {
      value: Number(data?.materialAvg?.Mineral),
      title: "Tiempo promedio / Mineral",
      valueColor: "text-[#14B8A6]",
      unid: "min",
      decimals: 2,
    },
    {
      value: Number(data?.materialAvg?.Desmonte),
      title: "Tiempo promedio / Desmonte",
      valueColor: "text-[#F59E0B]",
      unid: "min",
      decimals: 2,
    },
    {
      value: data?.disponibility?.value,
      title: "Disponiblidad",
      change: data?.disponibility?.value,
      valueColor: "text-purple-600",
      unid: "%",
      decimals: 2,
    },
    {
      value: data?.utilization?.value,
      title: "Utilización",
      change: data?.utilization?.value,
      valueColor: "text-pink-600",
      unid: "%",
      decimals: 2,
    },
  ];

  return (
    <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {cardData.map((card, index) => (
        <CardItem key={index} {...card} loading={isLoading}/>
      ))}
    </div>
  );
}