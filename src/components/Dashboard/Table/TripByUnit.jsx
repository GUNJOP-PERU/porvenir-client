import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import PropTypes from 'prop-types';

const TripsByUnitTable = ({ data }) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  console.log(data, "TripsByUnitTable")

  const formatUnit = (unit) => {
    if (unit && unit.startsWith('truck_')) {
      const number = unit.replace('truck_', '');
      return `Camion ${number}`;
    }
    return unit;
  };

  // Agrupar datos por destino
  const groupedData = data?.reduce((groups, item) => {
    const destination = item.destination;
    if (!groups[destination]) {
      groups[destination] = [];
    }
    groups[destination].push({
      truck: formatUnit(item.truck),
      origin: item.origin,
      frontLabors_ubication: item.frontLabors_ubication || "----",
      destination: item.destination,
      salida_origen: new Date(item.salida_origen).toLocaleString('es-ES'),
      cycleDuration: item.cycleDuration,
      cycleRawDuration: item.cycleRawDuration,
      maintenanceTime: item.maintenanceTime,
      shiftChangeTime: item.shiftChangeTime,
      tiempo_vacio: item.tiempo_vacio,
      tiempo_carga: item.tiempo_carga,
      tiempo_lleno: item.tiempo_lleno,
      tiempo_descarga: item.tiempo_descarga
    });
    return groups;
  }, {}) || {};

  const toggleGroup = (destination) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(destination)) {
      newExpanded.delete(destination);
    } else {
      newExpanded.add(destination);
    }
    setExpandedGroups(newExpanded);
  };

  const columnDefs = [
    { 
      headerName: 'Unidad', 
      field: 'truck', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    // { 
    //   headerName: 'Origen', 
    //   field: 'origin', 
    //   sortable: true, 
    //   filter: true,
    //   flex: 1
    // },
    { 
      headerName: 'Tajo', 
      field: 'frontLabors_ubication', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      headerName: 'Hora de Inicio', 
      field: 'salida_origen', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      headerName: 'Duración Ciclo (min)', 
      field: 'cycleDuration', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params) => params.value ? params.value.toFixed(2) : ''
    },
    { 
      headerName: 'Tiempo Vacío (min)', 
      field: 'tiempo_vacio', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params) => params.value ? params.value.toFixed(2) : ''
    },
    { 
      headerName: 'Tiempo Descarga (min)', 
      field: 'tiempo_descarga', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueFormatter: (params) => params.value ? params.value.toFixed(2) : ''
    }
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 pt-1">
        {Object.entries(groupedData).map(([destination, trips]) => (
          <div key={destination} className="border border-zinc-100 rounded-[10px] overflow-hidden ">
            {/* Header del grupo */}
            <div 
              className="bg-gray-100 p-3 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              onClick={() => toggleGroup(destination)}
            >
              <div className="flex items-center space-x-1.5 ">
                <span className="text-[8px] text-zinc-400">
                  {expandedGroups.has(destination) ? '▼' : '▶'}
                </span>
                <span className="font-semibold text-[12px]">📍 {destination}</span>
                <span className="text-zinc-400 text-[10px] font-bold">({trips.length} viajes)</span>
              </div>
            </div>
            
            {/* Contenido del grupo (tabla) */}
            {expandedGroups.has(destination) && (
              <div className="p-2">
                <div className="h-64 w-full">
                  <AgGridReact
                    rowData={trips}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 15, 20]}
                    domLayout="normal"
                   
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TripsByUnitTable.propTypes = {
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
    bocaminas: PropTypes.array.isRequired
  })).isRequired,
};

export default TripsByUnitTable;
