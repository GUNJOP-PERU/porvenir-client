import PropTypes from "prop-types";
import "./styles.css"

const ProgressBarSmall = ({progressBarData}) => {
  const currentPercentage = (progressBarData.currentValue/progressBarData.total)*100

  return (
    <div className="progress-bar--container small">
      <span className="progress-bar-label">
        <b className="text-white">{progressBarData.showTitle ? progressBarData.title : ""}</b> 
        <b className="text-black">{progressBarData.currentValue} min</b> 
      </span>
      <div
        className="currentValue-bar"
        style={{
          width: `${currentPercentage > 100 ? 100 : currentPercentage}%`
        }}
      ></div>
    </div>
  )
}

ProgressBarSmall.propTypes = {
  progressBarData: PropTypes.shape({
    title: PropTypes.string,
    showTitle: PropTypes.bool,
    total: PropTypes.number,
    currentValue: PropTypes.number,
    currentValueColor: PropTypes.string,
  }).isRequired
};

export default ProgressBarSmall