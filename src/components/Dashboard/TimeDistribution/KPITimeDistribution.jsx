import CardItem from "../CardItem";

export default function KPITimeDistribution({ data }) {
  const cardData = [
    {
      value: data?.avg_time_cycle_min || 0,
      title: "Tiempo Prom. / Ciclo",
      valueColor: "text-sky-500",
      unid: "min",
    },   
    {
      value: data?.materialAvg?.Mineral || 0,
      title: "Tiempo promedio / Mineral",
      valueColor: "text-[#14B8A6]",
      unid: "min",
    },
    {
      value: data?.materialAvg?.Desmonte || 0,
      title: "Tiempo promedio / Desmonte",
      valueColor: "text-[#F59E0B]",
      unid: "min",
    },
    {
      value: data?.disponibility?.value || 0,
      title: "Disponiblidad",
      change: data?.disponibility?.value || 0,
      valueColor: "text-purple-600",
      unid: "%",
    },
    {
      value: data?.utilization?.value || 0,
      title: "Utilización",
      change: data?.utilization?.value || 0,
      valueColor: "text-pink-600",
      unid: "%",
    },
  ];

  return (
    <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {cardData.map((card, index) => (
        <CardItem key={index} {...card} />
      ))}
    </div>
  );
}