import type { BeaconCycle } from "../types/Beacon";
import { getCurrentDay } from "./dateUtils";

export interface PredictionResult {
  predictedTotalTrips: number;
  predictedTotalTM: number;
  tripsPerHour: number;
  elapsedHours: number;
  remainingHours: number;
  confidence: number;
  method: string;
  activeTrucks: number;
  avgTripDuration: number;
  efficiencyFactor: number;
}

export const calculateTripPrediction = (
  data: BeaconCycle[],
  beaconTruck: { status: string }[],
  mineralWeight: number = 36
): PredictionResult => {
  // Si no hay datos, retornar valores por defecto
  if (!data || data.length === 0) {
    return {
      predictedTotalTrips: 0,
      predictedTotalTM: 0,
      tripsPerHour: 0,
      elapsedHours: 0,
      remainingHours: 0,
      confidence: 0,
      method: 'no-data',
      activeTrucks: 0,
      avgTripDuration: 0,
      efficiencyFactor: 1,
    };
  }

  const now = new Date();
  const shiftStartDate = new Date(getCurrentDay().startDate);
  const elapsedHours = Math.max(0.1, (now.getTime() - shiftStartDate.getTime()) / (1000 * 60 * 60));
  const remainingHours = Math.max(0, 12 - elapsedHours);
  
  const currentTrips = data.reduce((acc, truck) => acc + truck.totalTrips, 0);
  const activeTrucks = data.filter((truck) => truck.trips.length > 0).length;
  
  const totalDuration = data.reduce((acc, truck) => 
    acc + truck.trips.reduce((innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration), 0), 0
  );
  const avgTripDurationHours = currentTrips > 0 ? (totalDuration / 3600) / currentTrips : 1.5;
  const tripsPerHour = elapsedHours > 0 ? currentTrips / elapsedHours : 0;

  const realTripsPerTruckPerHour = avgTripDurationHours > 0 ? 1 / avgTripDurationHours : 0.67;
  
  const currentRatePerTruck = tripsPerHour / Math.max(1, activeTrucks);
  
  const expectedTripsPerTruckPerHour = Math.max(realTripsPerTruckPerHour, currentRatePerTruck * 0.9);
  const expectedTotalTripsPerHour = activeTrucks * expectedTripsPerTruckPerHour;
  const predictedTotalTrips = Math.round(expectedTotalTripsPerHour * elapsedHours);
  
  let confidence: number;
  let method: string;
  
  if (elapsedHours < 2) {
    confidence = 40;
    method = 'early-stage';
  } else if (elapsedHours < 6) {
    confidence = 70;
    method = 'mid-stage';
  } else {
    confidence = 90;
    method = 'advanced-stage';
  }
  
  return {
    predictedTotalTrips,
    predictedTotalTM: predictedTotalTrips * mineralWeight,
    tripsPerHour: Number(tripsPerHour.toFixed(2)),
    elapsedHours: Number(elapsedHours.toFixed(2)),
    remainingHours: Number(remainingHours.toFixed(2)),
    confidence,
    method,
    activeTrucks,
    avgTripDuration: Number(avgTripDurationHours.toFixed(2)),
    efficiencyFactor: 1.0,
  };
};