import PropTypes from "prop-types";
import "./styles.css"

const ProgressBarSmall = ({progressBarData}) => {
  const currentPercentage = (progressBarData.currentValue/progressBarData.total)*100

  return (
    <div className="progress-bar--container small">
      <span className="progress-bar-label">
        <b 
          style={{
            color:`${currentPercentage > 20 ? "#FFFFFF" : "#000000"}`
          }}
        >{progressBarData.showTitle ? progressBarData.title : ""}</b> 
        <b
          style={{
            color: "#000000",
            backgroundColor: "#ddddddd8",
            padding: "1px 3px",
            borderRadius: "4px",
          }}
        >{progressBarData.currentValue ? `${progressBarData.currentValue} min` : "No Data"}</b> 
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