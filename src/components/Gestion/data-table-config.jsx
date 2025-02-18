// src/config/tableConfigs.js

import {
  cargo,
  dataMaterial,
  dataPhase,
  dataTypeVehicle,
  statuses,
  turn,
} from "@/lib/data";

export const tableConfigs = {
  users: {
    searchColumns: ["name"],
    filters: [
      { columnId: "role", title: "Rol", options: statuses },
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
  planDays: {
    searchColumns: ["frontLabor"],
    filters: [
      { columnId: "shift", title: "Turno", options: turn },
      { columnId: "phase", title: "Fase", options: dataPhase },
    ],
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
};
