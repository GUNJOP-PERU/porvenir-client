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

export type UnitBeaconDetection = {
    _id: string,
    mac: string,
    unit: string,
    f_inicio: number,
    f_final: number,
    duration: number,
    rssi_min: -99,
    rssi_max: -98,
    rssi_mean: -98,
    distance: 58.52,
    uuid: string,
    connection: string,
    wap: string,
    wap_mac: string,
    dateString: string,
    shift: string,
    rssi: {
      rssi: number,
      datetime: number,
      distance: number
    }[],
    rssi_discard: {
      rssi: number,
      datetime: number,
      distance: number
    }[],
    rb_info: [],
    __v: 0,
    createdAt: string,
    updatedAt: string
}