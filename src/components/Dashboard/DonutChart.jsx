import PropTypes from "prop-types";
import ProgressBar from "@/components/Dashboard/ProgressBar"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DonutChart = ({ title, donutData, progressBar, showSmall }) => {
  const options = {
    chart: {
      type: "pie",
      width: showSmall ? 100:120,
      height: showSmall ? 100:120, 
      events: {
        load() {
          const chart = this;
          chart.customLabel = chart.renderer
            .text(
              `${donutData?.currentValue || 0}%`,
              chart.plotWidth / 2 + chart.plotLeft,
              chart.plotHeight / 2 + chart.plotTop + 6
            )
            .css({
              color: "#000",
              fontSize: showSmall ? "16px":"20px",
              fontWeight: "bold",
              textAlign: "center",
            })
            .attr({
              align: "center",
              zIndex: 5,
            })
            .add();
        },
      },
    },
    title: {
      text: "",
    },
    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Porcentaje",
        data: [
          {
            name: "Valor Actual",
            y: donutData?.currentValue || 0,
            color: donutData.currentValueColor || "#04c285",
          },
          {
            name: "Restante",
            y: (donutData?.total || 0) - (donutData?.currentValue || 0),
            color: "#d6d6df",
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const updateCenterText = (chart) => {
    if (chart && chart.customLabel) {
      chart.customLabel.attr({
        text: `${donutData?.currentValue || 0}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {title &&
        <h3 className="font-bold text-center">
          {title}
        </h3>
      }
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        callback={(chart) => updateCenterText(chart)}
      />
      {progressBar ?
        <ProgressBar
          progressBarData={{
            ...progressBar,
            showDifference: true
          }}
        />
        :<></>
      }
    </div>
  );
};

DonutChart.propTypes = {
  title: PropTypes.string,
  showSmall: PropTypes.bool,
  donutData: PropTypes.shape({
    total: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    currentValueColor: PropTypes.string
  }),
  progressBar: PropTypes.shape({
    total: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    prediction: PropTypes.number.isRequired,
    currentValueColor: PropTypes.string
  })
};

export default DonutChart;