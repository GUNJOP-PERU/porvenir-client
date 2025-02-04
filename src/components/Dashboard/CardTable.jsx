import React from "react";

export default function CardTable() {
  // Datos dinámicos para generar la tabla
const data = [
    {
      id: 1,
      equipo: "SC-21 TJ824",
      ultimoEvento: "ID-318",
      horasProductivas: 2.6,
      horasPlanificadas: 13,
      horasNoPlanificadas: 34,
      horasImproductivas: 234,
      disponibilidad: "35%",
      utilizacion: "15%",
    },
    {
      id: 2,
      equipo: "SC-22 TJ825",
      ultimoEvento: "ID-319",
      horasProductivas: 3.2,
      horasPlanificadas: 14,
      horasNoPlanificadas: 30,
      horasImproductivas: 210,
      disponibilidad: "40%",
      utilizacion: "20%",
    },
    {
      id: 3,
      equipo: "SC-23 TJ826",
      ultimoEvento: "ID-320",
      horasProductivas: 5.1,
      horasPlanificadas: 16,
      horasNoPlanificadas: 28,
      horasImproductivas: 180,
      disponibilidad: "45%",
      utilizacion: "25%",
    },
    {
      id: 4,
      equipo: "SC-24 TJ827",
      ultimoEvento: "ID-321",
      horasProductivas: 4.3,
      horasPlanificadas: 15,
      horasNoPlanificadas: 40,
      horasImproductivas: 200,
      disponibilidad: "30%",
      utilizacion: "18%",
    },
    {
      id: 5,
      equipo: "SC-25 TJ828",
      ultimoEvento: "ID-322",
      horasProductivas: 6.4,
      horasPlanificadas: 18,
      horasNoPlanificadas: 35,
      horasImproductivas: 150,
      disponibilidad: "50%",
      utilizacion: "30%",
    },
    {
      id: 6,
      equipo: "SC-26 TJ829",
      ultimoEvento: "ID-323",
      horasProductivas: 3.0,
      horasPlanificadas: 14,
      horasNoPlanificadas: 45,
      horasImproductivas: 210,
      disponibilidad: "38%",
      utilizacion: "22%",
    },
    {
      id: 7,
      equipo: "SC-27 TJ830",
      ultimoEvento: "ID-324",
      horasProductivas: 4.9,
      horasPlanificadas: 20,
      horasNoPlanificadas: 30,
      horasImproductivas: 175,
      disponibilidad: "48%",
      utilizacion: "28%",
    },
    {
      id: 8,
      equipo: "SC-28 TJ831",
      ultimoEvento: "ID-325",
      horasProductivas: 2.7,
      horasPlanificadas: 12,
      horasNoPlanificadas: 50,
      horasImproductivas: 220,
      disponibilidad: "33%",
      utilizacion: "17%",
    },
    {
      id: 9,
      equipo: "SC-29 TJ832",
      ultimoEvento: "ID-326",
      horasProductivas: 5.5,
      horasPlanificadas: 17,
      horasNoPlanificadas: 25,
      horasImproductivas: 160,
      disponibilidad: "52%",
      utilizacion: "27%",
    },
    {
      id: 10,
      equipo: "SC-30 TJ833",
      ultimoEvento: "ID-327",
      horasProductivas: 6.0,
      horasPlanificadas: 19,
      horasNoPlanificadas: 40,
      horasImproductivas: 190,
      disponibilidad: "47%",
      utilizacion: "35%",
    },
  ];

  // Obtener las claves del primer objeto para usarlas como encabezados
  const headers = Object.keys(data[0]);

  return (
    <>
      {data.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">Datos de Equipos</h4>
          <div className="overflow-y-auto max-h-32">
            <table className="min-w-full table-auto border-collapse ">
              {/* Cabecera de la tabla */}
              <thead className="text-[10px] bg-zinc-100 text-zinc-400">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left ">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* Cuerpo de la tabla */}
              <tbody className="text-xs">
                {data.map((row, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td key={header} className="px-4 py-2 border-b">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mx-auto text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
