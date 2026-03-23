// src/config/tableConfigs.js

import {
  beaconCategory,
  cargo,
  dataMaterial,
  dataPhase,
  dataTypeVehicle,
  turn,
} from "@/lib/data";

export const tableConfigs = {
  users: {
    searchColumns: ["name"],
    filters: [     
      { columnId: "cargo", title: "Cargo", options: cargo },
    ],
  },
  enterprises: {
    searchColumns: ["name"],
  },
  vehicles: {
    searchColumns: ["tagName"],
    filters: [{ columnId: "type", title: "Vehiculo", options: dataTypeVehicle },],
  },
  frontLabors: {
    searchColumns: ["name"],
  },
  workerOrders: {
    searchColumns: ["frontLabor"],
    filters: [{ columnId: "shift", title: "Turno", options: turn }],
  },
  checklists: {
    searchColumns: ["userName", "vehicleTagName"],
    filters: [
      { columnId: "shift", title: "Turno", options: turn },
      { columnId: "vehicleType", title: "Vehiculo", options: dataTypeVehicle },
    ],
  },
  cycles: {
    searchColumns: ["user", "tagName","frontLabor"],
    filters: [
      { columnId: "shift", title: "Turno", options: turn },
      { columnId: "material", title: "Material", options: dataMaterial },
    ],
  },
  activities: {
    searchColumns: ["user", "tagName","frontLabor"],
    filters: [
        { columnId: "shift", title: "Turno", options: turn },
        { columnId: "material", title: "Material", options: dataMaterial },
    ],
  },
  trips: {
    searchColumns: ["unit"],
    filters: [
        { columnId: "shift", title: "Turno", options: turn },
        { columnId: "tripType", title: "Material", options: dataMaterial },
    ],
  },
  beacon: {
    searchColumns: ["nombre", "mac", "operacion", "categoria", "location"],
    filters: [
        { columnId: "categoria", title: "Categoria", options: beaconCategory },
    ],
  },
};
