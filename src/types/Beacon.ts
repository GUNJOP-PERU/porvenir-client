export type BeaconCycle= {
  unit: string,
  totalTrips: number,
  trips: BeaconTrip[]
}

export type BeaconTrip = {
  totalDistance: number,
  totalDuration: string,
  shift: "dia" | "noche",
  startDate: Date,
  endDate: Date,
  startUbication: string,
  endUbication: string,
  trip: {
    _id: string,
    mac: string,
    unit: string,
    f_inicio: Date,
    f_final: Date,
    duration: number,
    distance: number,
    uuid: string,
    connection: string,
    ubication: string,
    ubicationType: string
  }[]
}
