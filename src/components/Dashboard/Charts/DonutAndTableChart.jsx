import DonutChart from "./DonutChart"
import PropTypes from "prop-types"
import ProgressBarSmall from "./ProgressBarSmall"

const DonutAndTableChart = ({ title, donutData, tableData = [] }) => {
  return (
    <div className="flex flex-row gap-2">
      <div>
        {donutData.map((data,i) => (
          <DonutChart
            key={i}
            title={data.title}
            showSmall={true}
            donutData={data}
          />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-center">
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

DonutAndTableChart.propTypes = {
  title: PropTypes.string.isRequired,
  donutData: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    currentValueColor: PropTypes.string.isRequired,
  })),
  tableData: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    currentValue: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    subData: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      currentValue: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired
    }))
  }))
}


export default DonutAndTableChart