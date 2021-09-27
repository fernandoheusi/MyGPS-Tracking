import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { IntervalTypes } from '../screens/Home/hooks';

import { useStorage } from './storage'

export function useTracking(){
	const {manageLocation} = useStorage();

	const LOCATION_TASK_NAME = 'backgroundLocationTask';

	const startTracking = async (connectionInterval: IntervalTypes) => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status === 'granted') {
			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
				accuracy: Location.Accuracy.Lowest,
				timeInterval: connectionInterval,
				deferredUpdatesInterval: 10,
				distanceInterval: 0,
				foregroundService: {
					notificationTitle: "Geo-localização Ativa",
					notificationBody: "Estamos monitorando sua localização",
				},
			});
		}
		return true
	}

	const stopTracking = async () => {
		await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		console.log('Stopped background location task');

		return false
	}

	TaskManager.defineTask(LOCATION_TASK_NAME, async ({data,error}) => {
  	if (error) {
			console.error(error);
    	return;
  	}
  	if (data) {
			const [location] = (data as any).locations as Location.LocationObject[];
			await manageLocation(location);
		}
	});

	return {
		startTracking,
		stopTracking
	}
}