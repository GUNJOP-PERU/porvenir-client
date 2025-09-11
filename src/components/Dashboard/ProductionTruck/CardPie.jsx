import { useGraphicData } from "@/hooks/useGraphicData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { Suspense, useMemo } from "react";

const CardPie = React.memo(({ symbol, endpoint}) => {
  const { data = [], isLoading, isError } = useGraphicData(symbol, endpoint , "shift-variable");
  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "pie",
        marginRight: 0,
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 10,
        height: 280,
        // width: 280,
      },
      title: {
        text: "",
      },
      series: [
        {
          enableMouseTracking: false,

          colorByPoint: true,
          innerSize: "45%",
          data: data?.data_chart?.map((item) => ({
            name: item.title,
            y: item.value,
            color: item.fill,
          })),
        },
      ],
      tooltip: {
       
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          borderRadius: 10,
          dataLabels: {
            enabled: true,
            format:
              '<b><span style="color:{point.color}">{point.name}</span></b><br>' +
              '<span style=" font-size:14px">{point.percentage:.2f}%</span>',
            distance: 15,
            style: {
              fontSize: "10px",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
              whiteSpace: "normal", // Permite saltos de línea
              wordWrap: "break-word", // Divide automáticamente si es largo
              width: "80px", // Define un ancho para el ajuste automático
              textAlign: "center", // Centra el texto
            },
            // filter: {
            //   operator: ">",
            //   property: "percentage",
            //   value: 0.0,
            // },
          },
          showInLegend: true,
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
    }),
    [data]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[280px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
    
  return (
    <div className="w-full flex flex-1 justify-center items-center gap-2">
      <div style={{ width: "100%", overflowX: "auto" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="flex flex-col gap-2">
        {data?.data_card?.length > 0 ? (
          data?.data_card?.map((i, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center border rounded-xl p-3 px-3.5 gap-0.5"
            >
              <span className="text-[10px] text-center leading-3 font-semibold text-zinc-700 mb-1.5">
                {i.title}
              </span>
              <div className="flex justify-between gap-0.5">
                <h1 className="text-[#EF9517] font-black text-xl leading-5">
                  {i.value?.toFixed(2)}
                  <small className="font-extrabold">{i.unit?.charAt(0)}</small>
                </h1>
              </div>
              <span className="text-green-600 leading-[8px] text-[8px]">
                1.1 % más eficiente
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 text-[10px] leading-3 max-w-20">
            <div className="flex flex-col justify-center items-center border rounded-xl p-3 px-3.5 gap-0.5">
              <span className="text-[10px] text-center leading-3 font-semibold text-zinc-700 mb-1.5">
                Tiempo improductivo
              </span>
              <div className="flex justify-between gap-0.5">
                <h1 className="text-[#EF9517] font-black text-xl leading-5">
                  0.0
                  <small className="font-extrabold">h</small>
                </h1>
              </div>
              <span className="text-green-600 leading-[8px] text-[8px]">
                1.1 % más eficiente
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CardPie.displayName = "CardPie";
export default CardPie;
