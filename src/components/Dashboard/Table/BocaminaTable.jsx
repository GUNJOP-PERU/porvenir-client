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
  const groupedData = data?.reduce((groups, item) => {
    const truck = item.truck;
    if (!groups[truck]) {
      groups[truck] = {
        truck: formatUnit(truck),
        trips: [],
        bocaminas: item.bocaminas || [],
        totalCycleDuration: 0,
        avgCycleDuration: 0
      };
    }
    groups[truck].trips.push(item);
    groups[truck].totalCycleDuration += item.cycleDuration || 0;
    groups[truck].avgCycleDuration = groups[truck].totalCycleDuration / groups[truck].trips.length;
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
      field: 'duration', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params) => params.value ? params.value.toFixed(2) : ''
    },
    { 
      headerName: 'Inicio', 
      field: 'start', 
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
      field: 'end', 
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
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {Object.entries(groupedData).map(([truck, unitData]) => (
          <div key={truck} className="border border-gray-300 rounded-lg">
            {/* Header de la unidad */}
            <div 
              className="bg-gray-100 p-3 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              onClick={() => toggleUnit(truck)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg">
                  {expandedUnits.has(truck) ? '▼' : '▶'}
                </span>
                <span className="font-semibold text-black">🚛 {unitData.truck}</span>
                {/* <span className="text-gray-600 text-sm">
                  ({unitData.trips.length} viajes | Promedio: {unitData.avgCycleDuration.toFixed(2)} min)
                </span> */}
                <span className="text-gray-700 text-sm">
                  ({unitData.bocaminas.length} entradas a bocamina)
                </span>
              </div>
            </div>
            
            {/* Contenido expandido - Información de bocaminas */}
            {expandedUnits.has(truck) && (
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-700 mb-3">Entradas a Bocamina:</h4>
                {unitData.bocaminas.length > 0 ? (
                  <div className="h-64 w-full">
                    <AgGridReact
                      rowData={unitData.bocaminas}
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
                  <p className="text-gray-500 italic">No hay entradas a bocamina registradas para esta unidad.</p>
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
    truck: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    salida_origen: PropTypes.string.isRequired,
    cycleDuration: PropTypes.number.isRequired,
    cycleRawDuration: PropTypes.number.isRequired,
    maintenanceTime: PropTypes.number.isRequired,
    shiftChangeTime: PropTypes.number.isRequired,
    tiempo_vacio: PropTypes.number,
    tiempo_carga: PropTypes.number,
    tiempo_lleno: PropTypes.number,
    tiempo_descarga: PropTypes.number,
    path: PropTypes.arrayOf(PropTypes.shape({
      ubication: PropTypes.string.isRequired,
      ubicationType: PropTypes.string.isRequired,
      entrada: PropTypes.string.isRequired,
      salida: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      durationMin: PropTypes.number.isRequired,
      lastBeaconTimeMin: PropTypes.number,
      lastBeaconTime: PropTypes.string.isRequired
    })).isRequired,
    frontLabors_ubication: PropTypes.string,
    frontLabors: PropTypes.array.isRequired,
    bocaminas: PropTypes.arrayOf(PropTypes.shape({
      ubication: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired
    })).isRequired
  })).isRequired,
};

export default TripsByBocaminaTable;
