export type PlanDay = {
  _id: string,
  frontLabor: string,
  date: string,
  phase: string,
  tonnage: number,
  volquetes: string[],
  firma_volquetes: string[],
  state: "active" | "inactive",
  shift: "dia" | "noche",
  accept: string[],
  day: number,
  month: number,
  year: number,
  __v: number,
  createdAt: string,
  updatedAt: string
}