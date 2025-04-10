import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import ProgressBarCell from "@/components/Dashboard/Charts/ProgressBarCell";
import ShortIntervalTable from "@/components/Dashboard/Table/ShortIntervalControlTable";
// Fake Data
import { overallPlanFakeData, tableStatusFakeData, shovelsPlanFakeData } from "./dataFake";

const ShortIntervalControlV2  = () => {
  const cellStyles = "border border-gray-300 px-2 py-1 text-center text-[12px] whitespace-break-spaces"
  const labelStyle = "border border-gray-300 px-4 py-1 text-center font-bold text-[12px]"

  return (
    <div className="grid grid-cols-[280px_1fr] gap-4 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col gap-5">
        <DonutChart
          donutData={{
            total: overallPlanFakeData.total,
            currentValue: overallPlanFakeData.currentValue,
            currentValueColor: "#ff7989"
          }}
        />
        {overallPlanFakeData.data.map((cell,i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="grid grid-cols-[75px_1fr]">
              <span></span>
              <h3 className="text-center font-bold">
                {cell.title}
              </h3>
            </div>
            <div className="grid grid-cols-[75px_1fr] grid-rows-[45px]">
              <p className="flex items-end pb-[8px] h-full font-bold text-[12px] text-black">
                Shift
              </p>
              <ProgressBarCell
                currentValue={cell.shift.currentValue}
                total={cell.shift.total}
              />
            </div>
            <div className="grid grid-cols-[75px_1fr] grid-rows-[45px]">
              <p className="flex items-end pb-[8px] h-full font-bold text-[12px] text-black">
                Day
              </p>
              <ProgressBarCell
                currentValue={cell.day.currentValue}
                total={cell.day.total}
              />
            </div>
            <div className="grid grid-cols-[75px_1fr] grid-rows-[45px]">
              <p className="flex items-end pb-[8px] h-full font-bold text-[12px] text-black">
                Month
              </p>
              <ProgressBarCell
                currentValue={cell.month.currentValue}
                total={cell.month.total}
              />
            </div>
            
          </div>
        ))}

        <div>
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead>
              <tr className="bg-[#e2e2e2]">
                <th className={labelStyle}></th>
                <th className={labelStyle}>SHOVELS</th>
                <th className={labelStyle}>Trucks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={labelStyle}>REPAIR</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.shovels}</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.trucks}</td>
              </tr>
              <tr className="bg-[#e2e2e2]">
                <td className={labelStyle}>STANDBY</td>
                <td className={cellStyles}>{tableStatusFakeData.standby.shovels.join(", ")}</td>
                <td className={cellStyles}>{tableStatusFakeData.standby.trucks.join(", ")}</td>
              </tr>
              <tr>
                <td className={labelStyle}>OPERATE</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.shovels}</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.trucks}</td>
              </tr>
              <tr className="bg-[#e2e2e2]">
                <td className={labelStyle}>IDLE</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.shovels}</td>
                <td className={cellStyles}>{tableStatusFakeData.repair.trucks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ShortIntervalTable data={shovelsPlanFakeData}/>
    </div>
  )
}

export default ShortIntervalControlV2