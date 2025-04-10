import DonutChart from "../Charts/DonutChart";
import ProgressBarCell from "../Charts/ProgressBarCell";
import PropTypes from "prop-types";

const ShortIntervalTable = ({ data }) => {
  const labelCellStyle = "flex items-center font-bold text-[12px] text-left border border-gray-300 px-2 py-1"
  const cellStyles = "content-center border border-gray-300 px-2 py-1 text-center text-[13px]"

  return (
    <div className="flex flex-row overflow-x-auto overflow-y-hidden h-fit">
      <div className="grid grid-cols-[140px] grid-rows-[130px_repeat(2,60px)_repeat(6,30px)_1fr]">
        <p className={labelCellStyle}>Shovels plan</p>
        <p className={labelCellStyle}>EXTRACTION,t</p>
        <p className={labelCellStyle}>STRIPPING,m³</p>
        <p className={labelCellStyle}>lefTovers in area, m³</p>
        <p className={labelCellStyle}>Truck load, %</p>
        <p className={labelCellStyle}>Personal idles, min</p>
        <p className={labelCellStyle}>Production idles, min</p>
        <p className={labelCellStyle}>Material idles, min</p>
        <p className={labelCellStyle}>External idles, min</p>
        <p className={labelCellStyle}>Trucks plan</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${data.length},minMax(150px, 1fr))`,
          overflowX: "auto"
        }}
      >
        {data.map((columnData,i) => (
          <div
            key={i}
            className="grid grid-rows-[130px_repeat(2,60px)_repeat(6,30px)_1fr] overflow-x-auto overflow-y-hidden h-full"
          >
            <div className={cellStyles}>
              <DonutChart
                title={columnData.title}
                size="small"
                donutData={{
                  total: columnData.shovels.total,
                  currentValue: columnData.shovels.currentValue
                }}
              />
            </div>

            <div className={cellStyles}>
              <ProgressBarCell
                currentValue={columnData.extraction.currentValue}
                total={columnData.extraction.total}
              />
            </div>

            <div className={cellStyles}>
              <ProgressBarCell
                currentValue={columnData.stripping.currentValue}
                total={columnData.stripping.total}
              />
            </div>

            <p className={cellStyles}>{columnData.leftTovers}</p>
            <p className={cellStyles}>{columnData.truckLoad}</p>
            <p className={cellStyles}>{columnData.personalIdles}</p>
            <p className={cellStyles}>{columnData.productionIdles}</p>
            <p className={cellStyles}>{columnData.materialIdles}</p>
            <p className={cellStyles}>{columnData.externalIdles}</p>

            <div className="flex flex-col gap-1 border border-gray-300 px-2 py-1">
              {columnData.trucksPlan.map((truck,i) => (
                <DonutChart
                  key={i}
                  title={truck.title}
                  size="mini"
                  donutData={{
                    total: truck.total,
                    currentValue: truck.currentValue
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

ShortIntervalTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    shovels: PropTypes.shape({
      currentValue: PropTypes.number,
      total: PropTypes.number
    }),
    extraction: PropTypes.shape({
      currentValue: PropTypes.number,
      total: PropTypes.number,
    }),
    stripping: PropTypes.shape({
      currentValue: PropTypes.number,
      total: PropTypes.number
    }),
    leftTovers: PropTypes.number,
    truckLoad: PropTypes.number,
    personalIdles: PropTypes.number,
    productionIdles: PropTypes.number,
    materialIdles: PropTypes.number,
    externalIdles: PropTypes.number,
    trucksPlan: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      currentValue: PropTypes.number,
      total: PropTypes.number
    }))
  })).isRequired
};

export default ShortIntervalTable