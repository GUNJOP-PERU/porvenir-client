import "./styles.css"

interface ProgressBarProps {
  unit?: string,
  showPrediction?: boolean,
  progressBarData: {
    total: number,
    currentValue: number,
    prediction: number,
    currentValueColor: string,
    showDifference: boolean,
    forecastText: string
  }
}

const ProgressBar = ({progressBarData, showPrediction, unit} : ProgressBarProps) => {
  const differenceStatus = progressBarData.prediction - progressBarData.total
  return (
    <div className="progress-bar--container overflow-hidden rounded-md">
      <span className="progress-bar-label leading-none text-[10px]">
        Extraído <b>{progressBarData.currentValue} {unit ? unit:"TM"}</b> de <b>{progressBarData.total} {unit ? unit:"TM"}</b>
      </span>
      {progressBarData.showDifference &&
        <>
          <span
            style={{ color: `${progressBarData.currentValueColor || "#04c285"}`}}
            className="progress-bar-label-difference"
          >
            { differenceStatus >0  ? 
              `+${differenceStatus}`:
              `${differenceStatus}`
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
      {showPrediction &&
        <div
          style={{
            left:`${(progressBarData.prediction/progressBarData.total)*100}%`,
            borderLeft: `2px dotted ${progressBarData.currentValueColor || "#04c285"}`
          }}
          className="progress-bar-prediction-label"
        >
          <p>
            {progressBarData.forecastText ? progressBarData.forecastText : "Forecast"} <span style={{backgroundColor: `${progressBarData.currentValueColor || "#04c285"}`}}>{progressBarData.prediction} {unit ? unit:"TM"}</span>
          </p>
        </div>
      }
      <div className="currentValue-bar" style={{ width: `${(progressBarData.currentValue/progressBarData.total)*100}%`}}></div>
    </div>
  )
}

export default ProgressBar