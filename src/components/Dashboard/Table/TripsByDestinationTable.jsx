import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import PropTypes from 'prop-types';

const TripsByDestinationTable = ({ data }) => {
  const [expandedUnits, setExpandedUnits] = useState(new Set());

  const formatUnit = (unit) => {
    if (unit && unit.startsWith('truck_')) {
      const number = unit.replace('truck_', '');
      return `Camion ${number}`;
    }
    return unit;
  };

  const groupedData = data?.filter(item => item.ubicationType === "destino").reduce((groups, item) => {
    const destination = item.ubication;
    if (!groups[destination]) {
      groups[destination] = {
        truck: formatUnit(item.tag),
        destination: item.ubication,
        trips: [],
        duration: 0,
      };
    }
    groups[destination].trips.push(item);
    groups[destination].duration += item.duration || 0;
    return groups;
  }, {});

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
      headerName: 'Unidad', 
      field: 'tag', 
      sortable: true, 
      filter: true,
      flex: 1,
      valueFormatter: (params) => formatUnit(params.value)
    },
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
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {Object.entries(groupedData).map(([destination, unitData]) => (
          <div key={destination} className="border border-gray-300 rounded-lg">
            <div 
              className="bg-gray-100 p-3 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              onClick={() => toggleUnit(destination)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg">
                  {expandedUnits.has(destination) ? '▼' : '▶'}
                </span>
                <span className="font-semibold text-black">📍 {destination.replace('_', ' ')}</span>
                <span className="text-gray-700 text-sm">
                  ({unitData.trips.length} viajes)
                </span>
              </div>
            </div>
            
            {/* Contenido expandido - Información de bocaminas */}
            {expandedUnits.has(destination) && (
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-700 mb-3">Entradas a Bocamina:</h4>
                {unitData.trips.length > 0 ? (
                  <div className="h-64 w-full">
                    <AgGridReact
                      rowData={unitData.trips}
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

TripsByDestinationTable.propTypes = {
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

export default TripsByDestinationTable;
