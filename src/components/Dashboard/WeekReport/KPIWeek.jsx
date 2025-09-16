import { filterData, filterValidTrips } from "@/lib/utilsGeneral";
import CardItem from "../CardItem";
import { useMemo } from "react";

export default function KPIWeek({
  data = [],
  programmedMineral,
  programmedDesmonte,
}) {
  const getMetrics = (data = [], programmedMineral) => {
    const totalTravels = data.length;
    const totalTonnage = data.reduce((acc, item) => {
      return acc + item.tonnage;
    }, 0);

    const filteredData = useMemo(() => filterData(data), [data]);
    const filteredInvalidData = useMemo(() => filterValidTrips(data), [data]);
    const filteredMineral = filterData(filteredData, "mineral");
    const filteredDesmonte = filterData(filteredData, "desmonte");

    const travelsExtract = filteredData.length;
    const tonnageExtract = filteredData.reduce((acc, item) => {
      return acc + item.tonnage;
    }, 0);
    const travelRemanejo = filteredInvalidData.length;
    const tonnageRemanejo = filteredInvalidData.reduce((acc, item) => {
      return acc + item.tonnage;
    }, 0);
    const travelsMineral = filteredMineral.length;
    const tonnageMineral = filteredMineral.reduce((acc, item) => {
      return acc + item.tonnage;
    }, 0);
    const travelsDesmonte = filteredDesmonte.length;
    const tonnageDesmonte = filteredDesmonte.reduce((acc, item) => {
      return acc + item.tonnage;
    }, 0);
    const travelRemanejoPercentage = travelRemanejo > 0 ? (travelRemanejo / travelsExtract) * 100 : 0;
    const mineralPercentage = programmedMineral > 0 ? (travelsMineral / programmedMineral) * 100 : 0;
    const desmontePercentage = programmedDesmonte > 0 ? (travelsDesmonte / programmedDesmonte) * 100 : 0;
    return {
      totalTonnage,
      totalTravels,
      travelsExtract,
      tonnageExtract,
      travelRemanejo,
      tonnageRemanejo,
      travelRemanejoPercentage,
      travelsMineral,
      tonnageMineral,
      travelsDesmonte,
      tonnageDesmonte,
      mineralPercentage,
      desmontePercentage,
    };
  };

  const metrics = getMetrics(data, programmedMineral);

  const cardData = [
    {
      value: metrics.totalTravels,
      title: "Viajes Totales",
      valueColor: "text-[#1E64FA]",
      unid: "viajes",
      decimals: 2,
      subtitle: metrics.totalTonnage,
      subtitleUnid: "TM",
    },
    {
      value: metrics.travelsExtract,
      title: "Viajes Extracción",
      valueColor: "text-[#04C286]",
      unid: "viajes",
      subtitle: metrics.tonnageExtract,
      subtitleUnid: "TM",
    },
    {
      value: metrics.travelRemanejo,
      title: "Viajes Remanejo",
      valueColor: "text-[#FE7887]",
      unid: "viajes",
      subtitle: metrics.tonnageRemanejo,
      subtitleUnid: "TM",
    },
    {
      value: metrics.travelRemanejoPercentage,
      title: "% Viajes Remanejo",
      valueColor: "text-[#FE7887]",
      unid: "%",
      decimals: 2,
    },
    {
      value: metrics.travelsMineral,
      title: "Viajes Ext Mineral",
      valueColor: "text-[#14B8A6]",
      unid: "viajes",
      subtitle: metrics.tonnageMineral,
      subtitleUnid: "TM",
    },
    {
      value: metrics.mineralPercentage,
      title: "%Cumplimiento Programado de Mineral",
      valueColor: "text-[#00a0ff]",
      unid: "%",
      decimals: 2,
      subtitle: programmedMineral,
      subtitleUnid: "TM",
    },
    {
      value: metrics.travelsDesmonte,
      title: "Viajes Ext Desmonte",
      valueColor: "text-[#F59E0B]",
      unid: "viajes",
      subtitle: metrics.tonnageDesmonte,
      subtitleUnid: "TM",
    },
    {
      value: metrics.desmontePercentage,
      title: "%Cumplimiento Programado de Desmonte",
      valueColor: "text-[#00a0ff]",
      unid: "%",
      decimals: 2,
      subtitle: programmedDesmonte,
      subtitleUnid: "TM",
    },
  ];

  return (
    <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {cardData.map((item, index) => (
        <CardItem
          key={index}
          value={item.value}
          title={item.title}
          change={item.change}
          valueColor={item.valueColor}
          unid={item.unid}
          subtitle={item.subtitle}
          decimals={item.decimals}
          subtitleUnid={item.subtitleUnid}
        />
      ))}
    </div>
  );
}
