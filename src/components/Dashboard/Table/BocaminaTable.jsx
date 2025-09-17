import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import PropTypes from 'prop-types';

const TripsByBocaminaTable = ({ data }) => {
  const [expandedUnits, setExpandedUnits] = useState(new Set());

  const formatUnit = (unit) => {
    if (unit && unit.startsWith('truck_')) {
      const number = unit.replace('truck_', '');
      return `Camion ${number}`;
    }
    return unit;
  };

  // Agrupar datos por unidad (truck)
  const groupedData = data?.filter(item => item.ubicationType === "Bocamina").reduce((groups, item) => {
    const truck = item.tag;
    if (!groups[truck]) {
      groups[truck] = {
        truck: formatUnit(truck),
        trips: [],
        bocamina: item.ubication,
        entradas: [],
        duration: 0,
      };
    }
    groups[truck].trips.push(item);
    groups[truck].entradas.push(item);
    groups[truck].duration += item.duration || 0;
    return groups;
  }, {}) || {};

  const toggleUnit = (truck) => {
    setExpandedUnits(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(truck)) {
        newExpanded.delete(truck);
      } else {
        newExpanded.add(truck);
      }
      return newExpanded;
    });
  };

  // Definir columnas para la subgrilla de bocaminas
  const bocaminasColumnDefs = [
    { 
      headerName: 'Ubicación', 
      field: 'ubication', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      headerName: 'Duración (min)', 
      field: 'durationMin', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      // valueFormatter: (params) => params.value ? params.value.toFixed(2) : ''
    },
    { 
      headerName: 'Inicio', 
      field: 'tsStartDate', 
      sortable: true, 
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString('es-ES');
        }
        return '';
      }
    },
    { 
      headerName: 'Fin', 
      field: 'tsEndDate', 
      sortable: true, 
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString('es-ES');
        }
        return '';
      }
    }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 pt-1">
        {Object.entries(groupedData).map(([truck, unitData]) => (
          <div key={truck} className="border border-zinc-100 rounded-[10px] overflow-hidden">
            {/* Header de la unidad */}
            <div 
              className="bg-gray-100 p-3 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              onClick={() => toggleUnit(truck)}
            >
             <div className="flex items-center space-x-1.5 ">
              <span className="text-[8px] text-zinc-400">
                  {expandedUnits.has(truck) ? '▼' : '▶'}
                </span>
                <span className="font-semibold text-xs">🚛 {unitData.truck}</span>
                {/* <span className="text-gray-600 text-sm">
                  ({unitData.trips.length} viajes | Promedio: {unitData.avgCycleDuration.toFixed(2)} min)
                </span> */}
                <span className="text-zinc-400 text-[10px] font-bold">
                  ({unitData.bocaminas.length} viajes)
                </span>
              </div>
            </div>
            
            {/* Contenido expandido - Información de bocaminas */}
            {expandedUnits.has(truck) && (
              <div className="p-4 py-2 ">
                <h4 className="text-[11px] font-medium text-zinc-500 mb-1">Entradas a Bocamina:</h4>
                {unitData.bocaminas.length > 0 ? (
                  <div className="h-64 w-full">
                    <AgGridReact
                      rowData={unitData.entradas}
                      columnDefs={bocaminasColumnDefs}
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true,
                      }}
                      pagination={true}
                      paginationPageSize={5}
                      domLayout="normal"
                    />
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 italic">No hay entradas a bocamina registradas para esta unidad.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TripsByBocaminaTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    ubication: PropTypes.string.isRequired,
    ubicationType: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    durationMin: PropTypes.string.isRequired,
    tsStart: PropTypes.number.isRequired,
    tsEnd: PropTypes.number.isRequired,
    tsStartDate: PropTypes.string.isRequired,
    tsEndDate: PropTypes.string.isRequired
  })).isRequired,
};

export default TripsByBocaminaTable;
