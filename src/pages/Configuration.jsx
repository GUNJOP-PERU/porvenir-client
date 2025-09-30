import MineralConfiguration from "@/components/Configuration/MineralCard";
import TurnConfiguration from "@/components/Configuration/TurnCard";
import ActivityAverageTimeConfiguration from "@/components/Configuration/ActivityAverageTime";

const ConfigurationPage = () => {
  return (
    <>
      
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