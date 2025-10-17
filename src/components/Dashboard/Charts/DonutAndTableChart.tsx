import DonutChart from "./DonutChart"
import PropTypes from "prop-types"
import ProgressBarSmall from "./ProgressBarSmall"

interface DonutAndTableChartProps {
  title: string,
  donutData: {
    title: string,
    total: number,
    currentValue: number,
    currentValueColor: string
  }[],
  tableData: {
    title: string,
    currentValue: number,
    total: number,
    subData: {
      title: string,
      currentValue: number,
      total: number
    }[]
  }[]
}

const DonutAndTableChart = ({ title, donutData, tableData = [] }: DonutAndTableChartProps) => {
  return (
    <div className="flex flex-row gap-4">
      {/* <div className="flex flex-col gap-4 justify-around">
        {donutData.map((data,i) => (
          <DonutChart
            key={i}
            title={data.title}
            donutData={data}
            size="small"
          />
        ))}
      </div> */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-xs font-bold leading-3 text-center">
          {title}
        </h3>
        {tableData.map((data,i) => (
          <div key={i} className="flex flex-col">
            <ProgressBarSmall
              key={i}
              progressBarData={{...data, showTitle: true}}
            />
            {data.subData.map((subData,i) => (
              <div key={i} className="grid grid-cols-[1.5fr_1fr] px-2 py-1 text-[12px] items-center even:bg-[#f7f8f8]">
                <h4 className="font-bold text-left text-[#444545]">
                  {subData.title}
                </h4>
                <ProgressBarSmall
                  key={i}
                  progressBarData={subData}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonutAndTableChart