import CardTitle from "@/components/Dashboard/CardTitle";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import ExtractMaterial from "@/components/Dashboard/ProductionExtract/ExtractMaterial";
import HeatMap from "@/components/Dashboard/ProductionExtract/Heatmap";
import TripsPerHour from "@/components/Dashboard/ProductionExtract/TripsPerHour";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";
import {
  filterData,
} from "@/lib/utilsGeneral";
import TableObservations from "@/components/Dashboard/ProductionExtract/TableObservations";
import CardTravels from "@/components/Dashboard/ProductionExtract/CardTravels";
import KPIProduction from "@/components/Dashboard/ProductionExtract/KPIProduction";

export default function Body({
  dataPlanTurno,
  programmedTonnageMineral,
  programmedTonnageDesmonte,
  data,
  isLoading,
  isError,
  shift,
}) {
  
  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <KPIProduction
          filteredData={data}
          programmedTonnageMineral={programmedTonnageMineral}
          programmedTonnageDesmonte={programmedTonnageDesmonte}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <CardTitle
          title="Extracción de Mineral"
          subtitle="Tonelaje proyectado vs. transportado, evaluando desviaciones y eficiencia operativa."
          icon={IconMineral}
          classIcon="text-[#14B8A6]"
        >
          <ExtractMaterial
            material="mineral"
            data={data}
            dataPlan={dataPlanTurno}
            programmedTonnage={programmedTonnageMineral}
            colorPoint="#14B8A6"
            tonnageMaterial={36}
            isLoading={isLoading}
            isError={isError}
          />
        </CardTitle>
        <CardTitle
          title="Extracción de Desmonte"
          subtitle="Tonelaje proyectado vs. transportado, evaluando desviaciones y eficiencia operativa."
          icon={IconClearance}
          classIcon="text-[#F59E0B] fill-[#F59E0B]"
        >
          <ExtractMaterial
            material="desmonte"
            data={data}
            dataPlan={dataPlanTurno}
            programmedTonnage={programmedTonnageDesmonte}
            colorPoint="#F59E0B"
            tonnageMaterial={35}
            isLoading={isLoading}
            isError={isError}
          />
        </CardTitle>
        <CardTitle
          title="Ruta vs Tonelaje (Solo Viajes Mineral)"
          subtitle="Tonelaje transportado por origen y destino"
          icon={IconDash1}
          classIcon="text-[#74add1]"
        >
          <HeatMap
            data={filterData(data, "mineral")}
            isLoading={isLoading}
            isError={isError}
          />
        </CardTitle>
        <CardTitle
          title="Viajes de Producción y Avances"
          subtitle="Cantidad de viajes por Orígenes"
          icon={IconDash1}
          color="#74add1"
        >
          <CardTravels data={data} isLoading={isLoading} isError={isError} />
        </CardTitle>
        <CardTitle
          title="Viajes por Hora de Mineral y Desmonte"
          subtitle="Análisis de la cantidad de viajes realizados"
          icon={IconDash1}
        >
          <TripsPerHour
            data={data}
            shift={shift}
            isLoading={isLoading}
            isError={isError}
          />
        </CardTitle>
        <CardTitle title="Observaciones" subtitle="">
          <TableObservations />
        </CardTitle>
      </div>
    </>
  );
}