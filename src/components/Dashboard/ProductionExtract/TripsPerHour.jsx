import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TripsPerHour = ({ data, shift, isLoading, isError }) => {

  const formatHourRange = (hr) => {
    const start = hr % 12 || 12;
    const end = (hr + 1) % 12 || 12;
    const ampm = hr < 12 ? "a.m." : "p.m.";
    return `${start} a ${end} ${ampm}`;
  };

  const dataChart = useMemo(() => {
    const agrupado = {};

    // Precrear todas las horas del turno con 0 viajes
    const horasTurno =
      shift === "dia"
        ? Array.from({ length: 12 }, (_, i) => i + 6) // 6 a 17
        : [
            ...Array.from({ length: 6 }, (_, i) => i + 18),
            ...Array.from({ length: 6 }, (_, i) => i),
          ]; // 18 a 23 y 0 a 5

    horasTurno.forEach((h) => {
      const rango = formatHourRange(h);
      agrupado[rango] = {
        mineral: { viajes: 0, toneladas: 0 },
        desmonte: { viajes: 0, toneladas: 0 },
      };
    });

    // Filtrar datos por turno
    const dataFiltrada = data.filter((item) => {
      const fecha = new Date(item.start || item.createdAt);
      const hora = fecha.getHours();
      if (shift === "dia") return hora >= 6 && hora < 18;
      if (shift === "noche") return hora >= 18 || hora < 6;
      return true;
    });

    // Sumar viajes y toneladas a las horas ya creadas
    dataFiltrada.forEach((item) => {
      const fecha = new Date(item.start || item.createdAt);
      const hora = fecha.getHours();
      const rango = formatHourRange(hora);
      const material = item.material?.toLowerCase() || "otros";

      if (material.includes("mineral")) {
        agrupado[rango].mineral.viajes += 1;
        agrupado[rango].mineral.toneladas += item.tonnage || 0;
      } else if (material.includes("desmonte")) {
        agrupado[rango].desmonte.viajes += 1;
        agrupado[rango].desmonte.toneladas += item.tonnage || 0;
      }
    });

    const categorias = Object.keys(agrupado);

    return {
      categorias,
      valoresMineral: categorias.map((r) => agrupado[r].mineral.viajes),
      toneladasMineral: categorias.map((r) => agrupado[r].mineral.toneladas),
      valoresDesmonte: categorias.map((r) => agrupado[r].desmonte.viajes),
      toneladasDesmonte: categorias.map((r) => agrupado[r].desmonte.toneladas),
    };
  }, [data, shift]);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 250,
        marginTop: 5,
        marginBottom: 45,
      },
      title: { text: null },
      xAxis: {
        categories: dataChart.categorias,
        lineColor: "transparent",
        labels: {
          formatter: function () {
            return this.value.replace(/ (a\.m\.|p\.m\.)$/, "<br>$1");
          },
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            color: "#A1A1AA",
            fontFamily: "Nunito, sans-serif",
            lineHeight: "10",
          },
        },
      },

      yAxis: {
        title: { text: null },
        labels: {
          enabled: false,
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "0.65em",
        },
        formatter: function () {
          const hora = this.series.chart.xAxis[0].categories[this.point.x];
          let html = `<b style="color:#eaeaea">${hora}</b><br/>`;
          this.points.forEach((point) => {
            const toneladas =
              point.series.name === "Mineral"
                ? dataChart.toneladasMineral[point.point.index]
                : dataChart.toneladasDesmonte[point.point.index];
            html += `<b style="color:${point.color}">●</b> 
                     <b style="color:#eaeaea">${point.series.name}:</b> 
                     <b style="color:${point.color}">${toneladas.toLocaleString(
              "es-PE"
            )} TM
                     en <b>${point.y} viajes</b> <br/>`;
          });
          return html;
        },
      },
      plotOptions: {
        column: {
          grouping: true,

          pointPadding: 0,
          groupPadding: 0.05,
          borderWidth: 0,
          borderRadius: "20%",
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
              lineHeight: "1",
            },
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            padding: 2,
            borderWidth: 0,
            formatter: function () {
              return this.y === 0 ? null : this.y;
            },
          },
        },
      },
      series: [
        {
          name: "Mineral",
          data: dataChart.valoresMineral,
          color: "#14B8A6",
        },
        {
          name: "Desmonte",
          data: dataChart.valoresDesmonte,
          color: "#F59E0B",
        },
      ],
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
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
        itemMarginTop: 0,
        itemMarginBottom: 0,
        zIndex: 10,
      },
      credits: { enabled: false },
      accessibility: { enabled: false },
    }),
    [dataChart]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-100 animate-pulse flex flex-col items-center justify-center rounded-2xl w-full h-[250px]"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center w-full h-[250px]">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TripsPerHour;
