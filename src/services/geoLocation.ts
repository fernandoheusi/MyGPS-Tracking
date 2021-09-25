import {useState} from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { useStatus } from '../contexts/statusContext';

import { api } from './api';

type IntervalTypes =  10000 | 5000 | 3000 | 1000;
interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

export function useTracking() {
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	const [connectionInterval, setConnectionInterval] = useState<IntervalTypes>(10000);

	const [isTracking,setIsTracking] = useState(false);
	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);

	const {statusArray,setStatusArray} = useStatus();

	function toggleSwitch(){
		if (isSwitchEnabled) {
			stopTracking();
		} 
		if (!isSwitchEnabled) {
			startTracking(connectionInterval);
		}
		setIsSwitchEnabled(state => !state);
	}

	function handleSelectInterval(interval: IntervalTypes){
		if (isTracking){
			stopTracking();
			startTracking(interval);
		}
		setConnectionInterval(interval);
	}

	const LOCATION_TASK_NAME = 'backgroundLocationTask';

	const startTracking = async (connectionInterval: IntervalTypes) => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status === 'granted') {
			console.log('to aqui');
			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
				accuracy: Location.Accuracy.Lowest,
				timeInterval: connectionInterval,
				deferredUpdatesInterval: 10,
				distanceInterval: 0,
				foregroundService: {
					notificationTitle: "BackgroundLocation Is On",
					notificationBody: "We are tracking your location",
				},
			});
		}

		setIsTracking(true);
	}


	const stopTracking = async () => {
		await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		console.log('[tracking]', 'stopped background location task');
		setIsTracking(false);
	}

	TaskManager.defineTask(LOCATION_TASK_NAME, async ({data,error}) => {
  	if (error) {
    // Error occurred - check `error.message` for more details.
    	return;
  	}
  	if (data) {
			const [location] = (data as any).locations as Location.LocationObject[];

			const date = new Date(location!.timestamp);
			const time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

			const locationFormated = {
				id: `${date.getTime()}`,
				latitude: location!.coords.latitude,
				longitude: location!.coords.longitude,
				speed: location!.coords.speed!,
				time
			}

			const packageAtualized = [
				...packageArray,
				locationFormated
			]

			setPackageArray(packageAtualized);

			const pointStatusFormated = {
				id: locationFormated.id,
				synchronous: false,
				time: date
			}

			const pointsAtualized = [
				pointStatusFormated,
				...statusArray
			]

			setStatusArray(pointsAtualized);

			const updateStates = () => {
				const pointsSynchronized = statusArray.map(item => {
					item.synchronous = true
					return item
				});
				setStatusArray(pointsSynchronized);
				setPackageArray([]);
			}

			try {
				const date = new Date();
				const id = String(date.getTime());
				const response = await api.post(`/points/${id}`,packageArray);
				console.log('id: ',id)
				console.log('arraySuccess: ',packageArray);

				if(response) {updateStates()};

				console.log('response: ',response.data.status);
			} catch (error) {
				console.log(error);
				console.log('arrayError: ',packageArray);
			}

			console.log("connectionInterval: ",connectionInterval);
			return
		}
	});

	return {
		isSwitchEnabled,
		toggleSwitch,
		connectionInterval,
		handleSelectInterval
	}
}