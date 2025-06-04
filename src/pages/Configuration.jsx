import MineralConfiguration from "@/components/Configuration/MineralCard";
import TurnConfiguration from "@/components/Configuration/TurnCard";
import ActivityAverageTimeConfiguration from "@/components/Configuration/ActivityAverageTime";

const ConfigurationPage = () => {
  return (
    <>
      {/* <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold leading-6">Configuración General</h1>
          <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-fit  h-5 flex items-center justify-center px-1 font-bold ">
            {countItems(data || 0)}
          </span>{" "}
        </div>
        <p className="text-zinc-400 text-xs">
          Administre los parámetros globales para la app y app-web.
        </p>
      </div> */}
      
      <div className="grid grid-cols-2 grid-rows-[250px_250px_250px] gap-4">
        <div className="row-span-2 flex flex-col justify-center relative border border-[#ededed] shadow rounded-xl py-2 px-4">
          <MineralConfiguration/>
        </div>
        <div className="row-span-2 flex flex-col justify-center relative border border-[#ededed] shadow rounded-xl py-2 px-4">
          <ActivityAverageTimeConfiguration/>
        </div>
        <div className="flex flex-col justify-center relative border border-[#ededed] shadow rounded-xl py-2 px-4">
          <TurnConfiguration/>
        </div>
      </div>
    </>
  );
}

export default ConfigurationPage;