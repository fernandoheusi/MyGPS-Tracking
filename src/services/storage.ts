import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { useStatus } from '../contexts/statusContext';

import { api } from './api';

interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

export function useStorage(){
	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);
	const {statusArray,setStatusArray} = useStatus();

	const packageDataKey ='@mygpstracking:package';
	const statusDataKey ='@mygpstracking:status';

	const manageLocation = async (location:Location.LocationObject) => {
		const date = new Date(location!.timestamp);
		const time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		const id = String(date.getTime());

		const uniquePoint = statusArray.filter(item => item.id === id);
		if(uniquePoint.length>0){
			return
		}

		const locationFormated = {
			id,
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

		const	pointsAtualized = [
			pointStatusFormated,
			...statusArray
		]

		pointsAtualized.splice(100,1)
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
		} catch (error) {
			console.log(error);
			console.log('package not sent: ',packageAtualized);
		}
		return
	}

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

	return {manageLocation}
}