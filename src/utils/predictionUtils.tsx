import type { BeaconCycle } from "../types/Beacon";
import { getCurrentDay } from "./dateUtils";

export interface PredictionResult {
  predictedTotalTM: number;
  tripsPerHour: number;
  elapsedHours: number;
  remainingHours: number;
  activeTrucks: number;
  avgTripDuration: number;
  efficiencyFactor: number;
}

export const calculateTripPrediction = (
  data: BeaconCycle[],
  beaconTruck: { status: string }[],
  mineralWeight: number = 36,
  planDayTonnageBlending?: number
): PredictionResult => {
  // Si no hay datos, retornar valores por defecto
  if (!data || data.length === 0) {
    return {
      predictedTotalTM: 0,
      tripsPerHour: 0,
      elapsedHours: 0,
      remainingHours: 0,
      activeTrucks: 0,
      avgTripDuration: 0,
      efficiencyFactor: 1,
    };
  }

  const now = new Date();
  const shiftStartDate = new Date(getCurrentDay().startDate);

  const elapsedHours = Math.max(0, (now.getHours() - shiftStartDate.getHours()));
  const remainingHours = Math.max(0, 12 - elapsedHours);
  
  const currentTrips = data.reduce((acc, truck) => acc + truck.totalTrips, 0);
  const activeTrucks = data.filter((truck) => truck.trips.length > 0).length;
  
  const totalDuration = data.reduce((acc, truck) => 
    acc + truck.trips.reduce((innerAcc, trip) => innerAcc + trip.totalDurationMin, 0), 0
  );
  const avgTripDurationHours = currentTrips > 0 ? (totalDuration / 60) / currentTrips : 1.5;
  const tripsPerHour = elapsedHours > 0 ? currentTrips / elapsedHours : 0;

  const totalTonnageElapsedHours = currentTrips * mineralWeight;
  const totalTonnageRemainingHours = remainingHours * tripsPerHour * mineralWeight;

  const predictedTotalTM = Math.round(totalTonnageElapsedHours + totalTonnageRemainingHours);

  return {
    predictedTotalTM: predictedTotalTM !== 0 ? predictedTotalTM : planDayTonnageBlending || 0,
    tripsPerHour: Number(tripsPerHour.toFixed(2)),
    elapsedHours: Number(elapsedHours.toFixed(2)),
    remainingHours: Number(remainingHours.toFixed(2)),
    activeTrucks,
    avgTripDuration: Number(avgTripDurationHours.toFixed(2)),
    efficiencyFactor: 1.0,
  };
};