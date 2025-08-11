import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import PropTypes from 'prop-types';

const TripsByBocaminaTable = ({ data }) => {
  const formatUnit = (unit) => {
    if (unit && unit.startsWith('truck_')) {
      const number = unit.replace('truck_', '');
      return `Camion ${number}`;
    }
    return unit;
  };
  
  const rowData = data?.tripsByUnit?.map(item => ({
    unit: formatUnit(item.unit),
    count: item.count,
    firstMineEntrance: item.firstMineEntrance.name,
    durationMin: item.firstMineEntrance.durationMin,
    start: new Date(item.firstMineEntrance.start).toLocaleString('es-ES'),
    end: new Date(item.firstMineEntrance.end).toLocaleString('es-ES')
  })) || [];

  const columnDefs = [
    { 
      headerName: 'Unidad', 
      field: 'unit', 
      sortable: true, 
      filter: true,
      cellFormatter: (params) => params.value.split('_')[0],
      flex: 1
    },
    { 
      headerName: 'Cantidad', 
      field: 'count', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1
    },
    { 
      headerName: 'Primera Entrada Mina', 
      field: 'firstMineEntrance', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      headerName: 'Duración (min)', 
      field: 'durationMin', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      flex: 1
    },
    { 
      headerName: 'Inicio', 
      field: 'start', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      headerName: 'Fin', 
      field: 'end', 
      sortable: true, 
      filter: true,
      flex: 1
    }
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 w-full overflow-hidden">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 15, 20]}
          domLayout="normal"
        />
      </div>
    </div>
  );
};

TripsByBocaminaTable.propTypes = {
  data: PropTypes.shape({
    tripsByUnit: PropTypes.arrayOf(PropTypes.shape({
      unit: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      firstMineEntrance: PropTypes.shape({
        name: PropTypes.string.isRequired,
        durationMin: PropTypes.number.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
  })
};

export default TripsByBocaminaTable;
