import { getMetrics } from "@/lib/utilsGeneral";
import CardItem from "../CardItem";

export default function KPIProduction({
  filteredData,
  programmedTonnageMineral,
  programmedTonnageDesmonte,
  isLoading,
}) {
  const programmedTravels =
    Math.round(programmedTonnageMineral / 36) +
    Math.round(programmedTonnageDesmonte / 35);

  const metricsGeneral = getMetrics(
    filteredData,
    programmedTonnageMineral + programmedTonnageDesmonte,
    programmedTravels,
    true
  );

  const cardData = [
    {
      value: programmedTonnageMineral + programmedTonnageDesmonte,
      title: "Toneladas Programadas",
      valueColor: "text-[#1EE0EE]",
      unid: "TM",
      decimals: 0,
    },
    {
      value: metricsGeneral.executedTonnage,
      title: "Toneladas Ejecutadas",
      valueColor: "text-[#04C286]",
      unid: "TM",
    },
    {
      value: metricsGeneral.variationTonnage,
      title: "Toneladas Variación",
      valueColor: "text-[#FE7887]",
      unid: "TM",
    },
    {
      value: metricsGeneral.goalCompletionPercentage,
      title: "%Cumplimiento",
      change: metricsGeneral.goalCompletionPercentage,
      valueColor: "text-[#1E64FA]",
      unid: "%",
      decimals: 2,
    },
    {
      value: metricsGeneral.programmedTravels,
      title: "Viajes Programados",
      valueColor: "text-[#1EE0EE]",
      unid: "viajes",
    },
    {
      value: metricsGeneral.executedTravels,
      title: "Viajes Ejecutados",
      valueColor: "text-[#04C286]",
      unid: "viajes",
    },
    {
      value: metricsGeneral.variationTravels,
      title: "Viajes Variación",
      valueColor: "text-[#FE7887]",
      unid: "viajes",
    },
  ];
  return (
    <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {cardData.map((card, index) => (
        <CardItem
          key={index}
          value={card.value}
          title={card.title}
          change={card.change}
          valueColor={card.valueColor}
          unid={card.unid}
          decimals={card.decimals}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
