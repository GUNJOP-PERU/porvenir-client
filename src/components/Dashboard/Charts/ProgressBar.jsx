import PropTypes from "prop-types";
import "./styles.css"

const ProgressBar = ({progressBarData}) => {
  const differenceStatus = progressBarData.prediction - progressBarData.total
  return (
    <div className="progress-bar--container">
      <span className="progress-bar-label">
        Done <b>{progressBarData.currentValue}</b> of <b>{progressBarData.total}</b>
      </span>
      {progressBarData.showDifference &&
        <>
          <span
            style={{ color: `${progressBarData.currentValueColor || "#04c285"}`}}
            className="progress-bar-label-difference"
          >
            { differenceStatus >0  ? 
              `+${differenceStatus.toFixed(1)}`:
              `${differenceStatus.toFixed(1)}`
            }
          </span>

          <div 
            className="progress-bar-prediction-bar"
            style={{
              left: `${(progressBarData.currentValue/progressBarData.total)*100}%`,
              width: `${(Math.abs(differenceStatus)/progressBarData.total)*100}%`,
              background: `${progressBarData.currentValueColor || "#04c285"}`
            }}
          >
          </div>
        </>
      }
      <div
        style={{
          left:`${(progressBarData.prediction/progressBarData.total)*100}%`,
          borderLeft: `2px dotted ${progressBarData.currentValueColor || "#04c285"}`
        }}
        className="progress-bar-prediction-label"
      >
        <p>
          {progressBarData.forecastText ? progressBarData.forecastText : "Forecast"} <span style={{backgroundColor: `${progressBarData.currentValueColor || "#04c285"}`}}>{progressBarData.prediction}</span>
        </p>
      </div>
      <div className="currentValue-bar" style={{ width: `${(progressBarData.currentValue/progressBarData.total)*100}%`}}></div>
    </div>
  )
}

ProgressBar.propTypes = {
  progressBarData: PropTypes.shape({
    total: PropTypes.number,
    currentValue: PropTypes.number,
    prediction: PropTypes.number,
    currentValueColor: PropTypes.string,
    showDifference: PropTypes.bool,
    forecastText: PropTypes.string
  }).isRequired
};

export default ProgressBar