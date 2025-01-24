import React, { useState } from "react";

const TableCard = ({ data, month }) => {
  // Generar los días del mes
  const getDaysInMonth = (month) => {
    const daysInMonth = new Date(2024, month, 0).getDate(); // Cambia el año si es necesario
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(month);

  return (
    <table border="1" className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg text-xs">
      <thead>
      <tr className="bg-zinc-100">
          <th className="px-1 py-1 text-left">#</th>
          <th className="px-1 py-1 text-left">Labor</th>
          <th className="px-1 py-1 text-left">Fase</th>
        
          {days.map((day) => (
            <th key={day}>{day < 10 ? `0${day}` : day}-NOV</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td className="px-1 py-1.5 border-b">{index + 1}</td>
            <td className="px-1 py-1.5 border-b">{row.id}</td>
            <td className="px-1 py-1.5 border-b">{row.fase}</td>
          
            {days.map((day) => (
              <td className="px-1 py-1.5 border-b" key={day}>{row.values[day - 1] || ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5">Total</td>
          {days.map((day) => (
            <td key={day}>
              {data.reduce((sum, row) => sum + (row.values[day - 1] || 0), 0)}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};

export default TableCard;