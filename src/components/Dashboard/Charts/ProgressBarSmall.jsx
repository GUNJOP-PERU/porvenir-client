import PropTypes from "prop-types";
import "./styles.css"

const ProgressBarSmall = ({progressBarData}) => {

  return (
    <div className="progress-bar--container small">
      <span className="progress-bar-label">
        <b>{progressBarData.showTitle ? progressBarData.title : ""}</b> 
        <b>{progressBarData.currentValue}</b> 
      </span>
      <div className="currentValue-bar" style={{ width: `${(progressBarData.currentValue/progressBarData.total)*100}%`}}></div>
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