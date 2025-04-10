import PropTypes from "prop-types"
import "./styles.css"

const ProgressBarCell = ({ currentValue, total }) => {
  const widthBarValue = Math.abs(total-currentValue) + currentValue
  const statusColor = currentValue > total ? "#04c285":"#ff7989" 

  return (
    <div className="flex flex-col">
      <div className="flex justify-between w-full">
        <p className="font-bold text-[11px] m-0">{currentValue.toLocaleString('fr-FR')}</p>
        <p className="font-bold text-[11px] m-0">{total.toLocaleString('fr-FR')}</p>
      </div>
      <div
        className="h-[25px]"
        style={{background: statusColor}}
      >
        <div
          className="flex h-full items-center p-2 progress-bar-current-value bg-[#4a4a4a]"
          style={{
            width: `${(currentValue/widthBarValue)*100}%`
          }}
        >
          <p
            className="font-bold text-[13px]"
            style={{ color: statusColor}}
          >
            {(currentValue - total).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  )
}

ProgressBarCell.propTypes = {
  total: PropTypes.number.isRequired,
  currentValue: PropTypes.number.isRequired
};


export default ProgressBarCell