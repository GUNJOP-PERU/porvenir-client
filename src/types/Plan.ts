export type PlanDay = {
  _id: string;
  frontLabor: string;
  date: string;
  phase: string;
  tonnage: number;
  volquetes: string[];
  firma_volquetes: string[];
  state: "active" | "inactive";
  shift: "dia" | "noche";
  accept: string[];
  type: "blending" | "modificado";
  day: number;
  month: number;
  year: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
};

export type PlanWeek = {
  _id: string;
  year: number;
  month: number;
  week: number;
  status: string;
  totalTonnage: number;
  dataCalculate: {
    date: string;
    tonnageByTurno: {
      dia: number;
      noche: number;
    };
  }[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  idPlanWeek: number;
};
export type PlanMonth = {
  monthName: string;
  month: number;
  totalTonnage: number;
  year: number;
};
