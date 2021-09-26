import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import { useStatus } from '../contexts/statusContext';

import { api } from './api';
import { IntervalTypes } from '../screens/Home/hooks';

interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

export function useTracking(){
	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);
	const {statusArray,setStatusArray} = useStatus();

	const LOCATION_TASK_NAME = 'backgroundLocationTask';
	const packageDataKey ='@mygpstracking:package';
	const statusDataKey ='@mygpstracking:status';
	
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
	}


	const stopTracking = async () => {
		await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		console.log('[tracking]', 'stopped background location task');
	}

	useEffect(() => {
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
			await AsyncStorage.setItem(packageDataKey,JSON.stringify(packageAtualized));

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
			await AsyncStorage.setItem(statusDataKey,JSON.stringify(pointsAtualized));

			const updateStates = async () => {
				const pointsSynchronized = pointsAtualized.map(item => {
					item.synchronous = true
					return item
				});
				await AsyncStorage.setItem(statusDataKey,JSON.stringify(pointsSynchronized));
				setStatusArray(pointsSynchronized);

				await AsyncStorage.setItem(packageDataKey,JSON.stringify([]));
				setPackageArray([]);
			}

			try {
				const date = new Date();
				const id = String(date.getTime());
				const response = await api.post(`/points/${id}`,packageAtualized);
				console.log('id: ',id);
				console.log('package sent: ',packageAtualized);

				if(response) {updateStates()};

				console.log('response: ',response.data.status);
			} catch (error) {
				console.log(error);
				console.log('package not sent: ',packageAtualized);
			}

			return
		}
	});
	
	});

	const loadData = async () => {
		const packageResponse = await AsyncStorage.getItem(packageDataKey);
		const statusResponse = await AsyncStorage.getItem(statusDataKey);
		const packageResponseFormated = packageResponse ? JSON.parse(packageResponse) : [];
		const statusResponseFormated = statusResponse ? JSON.parse(statusResponse) : [];

		setPackageArray(packageResponseFormated);
		setStatusArray(statusResponseFormated);
	}
	
	useEffect(() => {
		loadData();
	},[])

	return {
		startTracking,
		stopTracking
	}
}