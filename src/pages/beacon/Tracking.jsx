import { useSocketTopicValue } from "@/hooks/useSocketValue";
import TimeAgo from "timeago-react";

export default function Tracking() {
  const socketTracking =
    useSocketTopicValue("cerrolindo/mina/operaciones/camiones/tracking", [
      "realtime",
      "tracking",
    ]) || [];

  const areasFijas = [
    "Faja_4",
    "Cancha_100",
    "Mantenimiento_Saturno_Wap",
    "Pahuaypite",
    "Parqueo_volquetes",
    "Bocamina 1800",
    "Bocamina 1820",
    "Bocamina 1830",
    "Bocamina 1875",
    "Bocamina 1910",
  ];

  const trackingByArea = socketTracking.reduce((acc, item) => {
    if (!acc[item.area]) acc[item.area] = [];
    acc[item.area].push(item);
    return acc;
  }, {});

  return (
    <div className="h-screen w-full bg-cover bg-no-repeat bg-center bg-[url('/map.png')] flex xl:justify-center xl:items-center flex-wrap overflow-auto p-4 custom-scrollbar">
      <div className="grid grid-cols-2 xl:grid-cols-3 auto-rows-[150px] gap-1">
        {areasFijas.map((area) => {
          const camiones = trackingByArea[area] || [];
          return (
            <div
              key={area}
              className="flex flex-col gap-1 rounded-xl p-2 bg-black/60 w-full"
            >
              <div className="flex items-center gap-1">
                <div className="text-xs font-semibold bg-[#417505] px-2 py-1 rounded-md text-white truncate">
                  {area}
                </div>
                <div className="w-6 text-center text-xs font-semibold bg-[#4a90e2] px-2 py-1 rounded-md text-white">
                  {camiones.length}
                </div>
              </div>
              {camiones.length === 0 ? (
                <span className="text-[10px] text-zinc-400 pl-1">
                  Sin datos disponibles    
                </span>
              ) : (
                <div className="w-full grid grid-cols-2 gap-1">
                  {camiones.map((item, index) => (
                    <div
                      key={index}
                      className="bg-black/70 flex flex-col gap-1 p-1.5 rounded-lg"
                    >
                      {/* <div className="text-xs font-bold bg-[#495259] text-white py-1.5 px-2 rounded-md text-center">
                        STN-CV-{item.name}                   
                      </div> */}
                      <TruckIcon className="h-auto w-14" name={item.name} />
                      <span className="text-[10px] leading-none text-zinc-300 pl-1">
                        Línea{" "}
                        <TimeAgo datetime={item.timestamp} locale="es" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// const faja4 = trackingByArea["Faja_4"] || [];
// const cancha = trackingByArea["Cancha_100"] || [];
// const tallerSaturno = trackingByArea["Mantenimiento_Saturno_Wap"] || [];
// const pahuaypite = trackingByArea["Pahuaypite"] || [];
// const parqueo = trackingByArea["Parqueo_volquetes"] || [];
// const bocamina_1 = trackingByArea["Bocamina 1875"] || [];
// const bocamina_2 = trackingByArea["Bocamina 1800"] || [];

const TruckIcon = ({className="", name = ""}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 8.642 5"
    className={className}
  >
    <path
      d="M82.365 334.599h344.999v11.476H82.365z"
      style={{
        fill: "#2a3133",
        fillOpacity: 1,
        strokeWidth: 21.8934,
      }}
      transform="matrix(-.01201 0 0 .0297 7.709 -6.803)"
    />
    <path
      d="M1238.341-524.453h1.447v4.338h-1.447z"
      style={{
        fill: "#3bafda",
        strokeWidth: 1,
      }}
      transform="matrix(-.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1235.716-527.309a.714.714 0 0 1 .663-.051l6.133 2.658h14.476c.22 0 .428.102.559.274a.666.666 0 0 1 .109.601l-1.935 7.24.561.743a.669.669 0 0 1-.155.55.704.704 0 0 1-.532.24h-19.499s-.697-.304-.697-.68v-11.005c0-.23.12-.444.317-.57z"
      style={{
        fill: "#ecba03",
        fillOpacity: 1,
        strokeWidth: 0.999999,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      fill="none"
      d="m-1215.788-515.116.584 2.847a.745.745 0 0 1-.162.597.72.72 0 0 1-.552.26l-20.982-.003v-3.701z"
      style={{
        fill: "#000",
        fillOpacity: 0,
        strokeWidth: 1,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1237.652-525.653h-4.589c-.673 0-.943.623-1.22 1.238l-2.089 4.64c-.11.243-.16.48-.151.749l.143 5.195h1.7a4.109 4.109 0 0 1 3.369-1.768 4.11 4.11 0 0 1 3.368 1.768h.699v-10.584a1.23 1.23 0 0 0-1.221-1.238h-.01z"
      style={{
        fill: "#ecba03",
        fillOpacity: 1,
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1239.277-524.28h-2.846c-.43 0-.707.345-.858.698l-1.55 3.604c-.151.354.084.808.514.808h4.74c.43 0 .775-.311.775-.699v-3.713c0-.387-.354-.699-.775-.699z"
      style={{
        fill: "#233239",
        fillOpacity: 1,
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1239.117-523.876h-2.846c-.43 0-.707.345-.859.698l-1.549 3.604a.6.6 0 0 0-.05.244.607.607 0 0 1-.119-.648l1.55-3.604c.151-.353.429-.699.858-.699h2.846c.421 0 .758.304.775.674a.823.823 0 0 0-.615-.27z"
      style={{
        fill: "#000",
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <g
      style={{
        fill: "#2a3133",
        fillOpacity: 1,
        strokeWidth: 22.1886,
      }}
    >
      <path
        d="M427.364 334.599v11.476H82.365v-11.476z"
        style={{
          fill: "#2a3133",
          fillOpacity: 1,
          strokeWidth: 22.1886,
        }}
        transform="matrix(-.01864 0 0 .01864 8.333 -2.838)"
      />
      <path
        d="M365.68 307.583c25.343 0 46.861 16.019 54.99 38.493H310.571c8.248-22.474 29.766-38.493 54.989-38.493z"
        style={{
          fill: "#2a3133",
          fillOpacity: 1,
          strokeWidth: 22.1886,
        }}
        transform="matrix(-.01864 0 0 .01864 8.333 -2.838)"
      />
    </g>
    <path
      d="M-1244.793-515.568h-.985a.636.636 0 0 0-.631.631v1.533c0 .345.286.631.631.631h.985z"
      style={{
        fill: "#2a3133",
        fillOpacity: 1,
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1240.521-515.758a3.618 3.618 0 1 1 0 7.236 3.618 3.618 0 0 1 0-7.236z"
      style={{
        fill: "#495259",
        fillOpacity: 1,
        strokeWidth: 1,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1238.63-512.14a1.892 1.892 0 0 1-3.782 0 1.89 1.89 0 0 1 1.89-1.889 1.89 1.89 0 0 1 1.892 1.888z"
      style={{
        fill: "#ecba03",
        fillOpacity: 1,
        strokeWidth: 0.999999,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1227.857-515.758a3.618 3.618 0 1 1 0 7.236 3.618 3.618 0 0 1 0-7.236z"
      style={{
        fill: "#495259",
        fillOpacity: 1,
        strokeWidth: 1,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1225.966-512.14a1.892 1.892 0 0 1-3.782 0 1.89 1.89 0 0 1 1.89-1.889 1.89 1.89 0 0 1 1.892 1.888z"
      style={{
        fill: "#ecba03",
        fillOpacity: 1,
        strokeWidth: 0.999999,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1220.62-515.758a3.618 3.618 0 1 1 0 7.236 3.618 3.618 0 0 1 0-7.236z"
      style={{
        fill: "#495259",
        fillOpacity: 1,
        strokeWidth: 1,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1218.729-512.14a1.892 1.892 0 0 1-3.782 0 1.89 1.89 0 0 1 1.891-1.889 1.89 1.89 0 0 1 1.891 1.888z"
      style={{
        fill: "#ecba03",
        fillOpacity: 1,
        strokeWidth: 0.999999,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1232.68-514.335h-3.05c-.294 0-.53.32-.53.698v1.045c0 .387.242.698.53.698h3.05c.293 0 .53-.32.53-.698v-1.045c0-.387-.243-.698-.53-.698z"
      style={{
        fill: "#2a3133",
        fillOpacity: 1,
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <path
      d="M-1219.777-523.123v6.524c0 .206 3.175.206 3.175 0v-6.524c0-.206-3.175-.206-3.175 0zm-15.265 0v6.524c0 .206 3.175.206 3.175 0v-6.524c0-.206-3.175-.206-3.175 0zm3.816 0v6.524c0 .206 3.175.206 3.175 0v-6.524c0-.206-3.175-.206-3.175 0zm3.816 0v6.524c0 .206 3.175.206 3.175 0v-6.524c0-.206-3.175-.206-3.175 0zm3.816 0v6.524c0 .206 3.175.206 3.175 0v-6.524c0-.206-3.175-.206-3.175 0z"
      style={{
        opacity: 0.1,
        fill: "#000",
        strokeWidth: 1.56287,
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    />
    <text
      xmlSpace="preserve"
      x={-1232.405}
      y={-516.672}
      style={{
        fontWeight: 700,
        fontSize: "9.2533px",
        lineHeight: 1,
        fontFamily: "&quot",
        InkscapeFontSpecification: "&quot",
        letterSpacing: 0,
        wordSpacing: 0,
        opacity: 1,
        fill: "#000",
        fillOpacity: 1,
        strokeWidth: 0,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "none",
      }}
      transform="matrix(.26458 0 0 .26458 329.78 139.546)"
    >
      <tspan
        x={-1232.405}
        y={-516.672}
        style={{
          fill: "#000",
          strokeWidth: 0,
          fontWeight: 800,
        }}
      >
        {name}
      </tspan>
    </text>
  </svg>
  );
};
