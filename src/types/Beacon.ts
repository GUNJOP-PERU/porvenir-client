export type BeaconCycle= {
  unit: string,
  totalTrips: number,
  totalMaintanceTimeMin: number,
  bocaminaStats: {name: string, count: number}[],
  trips: BeaconUnitTrip[]
}

export type BeaconUnitTrip = {
  totalDistance: number,
  totalDuration: string,
  shift: "dia" | "noche",
  startDate: Date,
  endDate: Date,
  startUbication: string,
  endUbication: string,
  trip: BeaconDetection[]
}

export type BeaconDetection = {
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

export type BeaconTruckStatus = {
  _id: string,
  tag: string,
  createdAt: string,
  isActive: boolean,
  lastDate: string,
  lastUbication: string,
  lastUbicationMac: string,
  name: string,
  status: "inoperativo" | "operativo" | "mantenimiento",
  updatedAt: string,
  comments: string[]
}