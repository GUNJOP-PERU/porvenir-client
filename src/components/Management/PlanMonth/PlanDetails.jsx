/* eslint-disable react/prop-types */
import dayjs from "dayjs";

export default function PlanDetails({ plan, mode }) {
  const planDay = plan;

  if (!planDay || !Array.isArray(planDay.dataEdit)) {
    return (
      <div className="mt-4 text-center text-zinc-400">
        <p className="text-center text-zinc-400 leading-4 mb-4 text-[11px]">
          <strong className="text-zinc-500 font-semibold">
            Sin datos disponibles
          </strong>
          <br />
          Lo sentimos, no hay datos para mostrar en este momento. Por favor,
          verifica tu selección e intente de nuevo más tarde.
        </p>
      </div>
    );
  }

  const rows = planDay.dataEdit;

  if (rows.length === 0) {
    return <div className="mt-4 text-center text-zinc-400">dataEdit vacío</div>;
  }

  const dynamicColumns = Object.keys(rows[0]).filter(
    (key) => !["zona", "labor", "fase"].includes(key),
  );

  const columnTotals = dynamicColumns.reduce((acc, col) => {
    acc[col] = rows.reduce((sum, row) => {
      const value = Number(row[col]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return acc;
  }, {});

  return (
    <div className="h-[80vh] flex-1 flex flex-col gap-1 min-w-0 ">
      <div className="mb-3">
        <h1 className="text-base font-extrabold">
          Planificación /{" "}
          <span className="text-primary capitalize">
            {mode === "weekly"
              ? `${dayjs(planDay.startDate).format("DD MMMM")} - ${dayjs(
                  planDay.endDate,
                ).format("DD MMMM")}`
              : planDay.month
                ? dayjs()
                    .month(planDay.month - 1)
                    .format("MMMM")
                : dayjs(planDay.startDate).format("MMMM")}
          </span>
        </h1>
        <span className="text-2xl font-extrabold">
          {planDay.totalTonnage.toLocaleString("es-MX")} TM
        </span>
      </div>
      <div className="overflow-x-auto w-full overflow-auto">
        <table className="min-w-max border border-[#FF500030] text-sm select-none">
          <thead className="sticky top-0 z-1">
            <tr>
              <th className="w-10 bg-[#959493] text-white" />
              <th className="bg-[#FF5000] text-white px-3 py-1.5">ZONA</th>
              <th className="bg-[#FF5000] text-white px-3 py-1.5">LABOR</th>
              <th className="bg-[#FF5000] text-white px-3 py-1.5">FASE</th>

              {dynamicColumns.map((col) => (
                <th key={col} className="bg-[#FF5000] px-3 py-1.5 ">
                  <span className="leading-none text-white text-right">
                    {col}
                  </span>
                </th>
              ))}
            </tr>
            <tr>
              <th className="bg-[#3c3c3c] text-white px-3 py-1.5" colSpan={4}>
                TOTAL
              </th>

              {dynamicColumns.map((col) => (
                <th
                  key={col}
                  className="bg-[#3c3c3c] px-3 py-1.5 text-white text-right"
                >
                  {columnTotals[col].toLocaleString()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.labor}>
                <td className="text-center bg-[#959493] text-white border border-[#FF500030] font-bold">
                  {index + 1}
                </td>
                <td className="px-3 py-1 border border-[#FF500030] w-[100px] uppercase">
                  {row.zona}
                </td>
                <td className="px-3 py-1 border border-[#FF500030] font-semibold text-green-600 w-[250px] uppercase">
                  {row.labor}
                </td>
                <td className="px-3 py-1 border border-[#FF500030] w-[100px] uppercase">
                  {row.fase}
                </td>
                {dynamicColumns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-1 border border-[#FF500030] text-right w-[130px]"
                  >
                    {(row[col] ?? 0).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
