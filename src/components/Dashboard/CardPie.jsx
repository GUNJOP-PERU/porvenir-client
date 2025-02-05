import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardPie({ data, title }) {

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "pie",
        marginTop: 0,
        marginBottom: 0,
        marginRight: 120,
        height: 250,
      },
      title: {
        text: "",
      },
      series: [
        {
          name: "",
          colorByPoint: false,
          innerSize: "60%",
          data: data?.data_chart?.map((item) => ({
            name: item.title,
            y: item.value,
            color: item.fill,
          })),
        },
      ],
      tooltip: {
        pointFormat:
          "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },
        headerFormat:
          '<span style="font-size: 11px; color: #A6A6A6; padding:10px">{point.key}</span><br>',
        valueDecimals: 1,
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 0,
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },

      legend: {
        align: "right",
        verticalAlign: "center",
        layout: "vertical",
        x: 0,
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: {
          color: "#1EE0EE",
        },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 1,
        itemMarginBottom: 1,
        zIndex: 10,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
    }),
    [data]
  );

  return (
    <>
      {data?.data_card?.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">{title}</h4>
          <div className="flex flex-1 justify-center items-center gap-2">
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div className="flex flex-col gap-1">
              {data?.data_card?.length > 0 ? (
                data?.data_card?.map((i, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center border rounded-2xl p-4 gap-0.5"
                  >
                    <span className="text-[10px] leading-3 font-semibold text-zinc-700">
                      {i.title}
                    </span>
                    <div className="flex justify-between gap-0.5">
                      <h1 className="text-[#EF9517] font-black text-2xl leading-8">
                        {i.value?.toFixed(1)}
                        <small className="font-extrabold">{i.unit}</small>
                      </h1>
                    </div>
                    <span className="text-green-600 leading-[8px] text-[10px]">
                      1.1 % más eficiente
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-[10px] leading-3 max-w-20">
                  {data?.data_card?.length === 0
                    ? "No hay datos disponibles."
                    : "Cargando datos..."}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
