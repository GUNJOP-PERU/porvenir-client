import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface BarChartFrontLaborProps {
  title?: string;
  data: { name: string; value: number }[];
  color: string;
}

const BarChartFrontLabor = ({ title = "Frentes de Labor", data, color }: BarChartFrontLaborProps) => {

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 300,
      backgroundColor: 'transparent',
      animation: false,
    },
    title: {
      text: "",
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    xAxis: {
      categories: data.map(item => item.name),
      title: {
        text: ''
      },
      labels: {
        style: {
          color: '#666',
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      min: 0,
      max: 7,
      title: {
        text: ''
      },
      labels: {
        style: {
          color: '#666',
          fontSize: '12px'
        }
      },
      gridLineColor: '#E0E0E0'
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        pointPadding: 0.1,
        groupPadding: 0.2,
        animation: false,
        dataLabels: {
          enabled: true,
          style: {
            color: '#333',
            fontSize: '11px',
            fontWeight: 'bold',
            textOutline: 'none'
          },
          formatter: function(this: any) {
            return this.y.toFixed(1);
          }
        }
      }
    },
    series: [{
      name: 'Producción',
      type: 'column',
      data: data.map((item, index) => ({
        y: item.value,
        color: color
      })),
      showInLegend: false
    }],
    tooltip: {
      backgroundColor: '#111214',
      borderWidth: 0,
      shadow: false,
      borderRadius: 8,
      style: {
        color: '#FFFFFF',
        fontSize: '12px'
      },
      formatter: function(this: any) {
        return `<b>${this.x}</b><br/>Valor: ${this.y.toFixed(1)}`;
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-white bg-[#ff5000] font-bold text-center py-1 px-2">
        {title}
      </h3>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
      />
    </div>
  );
};

export default BarChartFrontLabor;
