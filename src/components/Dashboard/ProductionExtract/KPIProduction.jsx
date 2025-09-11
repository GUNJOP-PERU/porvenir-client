import { getMetrics } from "@/lib/utilsGeneral";
import CardItem from "../CardItem";

export default function KPIProduction({ filteredData, programmedTonnageMineral, programmedTonnageDesmonte }) {
  
  const programmedTravels =
  Math.round(programmedTonnageMineral / 36) +
  Math.round(programmedTonnageDesmonte / 35);
  
  const metricsGeneral = getMetrics(filteredData, programmedTonnageMineral + programmedTonnageDesmonte, programmedTravels, true);

  return (
    <>
      <CardItem
        value={programmedTonnageMineral + programmedTonnageDesmonte}
        title="Toneladas Programadas"
        valueColor="text-[#1EE0EE]"
        unid="TM"
        decimals={0}
      />
      <CardItem
        value={metricsGeneral.executedTonnage}
        title="Toneladas Ejecutadas"
        valueColor="text-[#04C286]"
        unid="TM"
      />
      <CardItem
        value={metricsGeneral.variationTonnage}
        title="Toneladas Variación"
        valueColor="text-[#FE7887]"
        unid="TM"
      />
      <CardItem
        value={metricsGeneral.goalCompletionPercentage}
        title="%Cumplimiento"
        change={metricsGeneral.goalCompletionPercentage}
        valueColor="text-[#1E64FA]"
        unid="%"
      />
      <CardItem
        value={metricsGeneral.programmedTravels}
        title="Viajes Programados"
        valueColor="text-[#1EE0EE]"
        unid="viajes"
      />
      <CardItem
        value={metricsGeneral.executedTravels}
        title="Viajes Ejecutados"
        valueColor="text-[#04C286]"
        unid="viajes"
      />
      <CardItem
        value={metricsGeneral.variationTravels}
        title="Viajes Variación"
        valueColor="text-[#FE7887]"
        unid="viajes"
      />
    </>
  );
}
