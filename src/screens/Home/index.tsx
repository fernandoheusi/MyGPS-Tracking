import React, { useState } from 'react';
import { Alert, Switch } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import { HeaderButton } from '../../components/HeaderButton';
import { SelectButton } from '../../components/SelectButton';
import { Separator } from '../../components/Separator';

import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';

import { useStatus } from '../../contexts/statusContext';

import { StackScreenProps } from '@react-navigation/stack';

import { 
	ConnectionStatusCard, 
	Container, 
	Greeting, 
	Header, 
	IntervalSelection, 
	SelectButtons, 
	ServiceStatus, 
	StatusConnection, 
	StatusTexts, 
	TextDark, 
	TextLight, 
	Title, 
	TitleAndStatus 
} from './styles';
import theme from '../../styles/theme';

type Props = StackScreenProps<any,'Home'>;
type IntervalTypes =  10000 | 5000 | 3000 | 1000;
interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false); //continua aqui
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	const [isTracking,setIsTracking] = useState(false);
	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);
	const [connectionInterval, setConnectionInterval] = useState<IntervalTypes>(10000);

	const {statusArray,setStatusArray} = useStatus();

	NetInfo.addEventListener(state => {  //continua aqui
			if (state.isConnected != statusConnection){setStatusConnection(state.isConnected!)}
	});

	function handleStatus(){ //continua aqui
		navigation.navigate('Status');
	}

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

	return(
		<Container>
			<Header>
				<Greeting>Olá, bem-vindo</Greeting>

				<HeaderButton title='Status' onPress={handleStatus}/>
			</Header>

			<ConnectionStatusCard>
				<Logo width={60}/>

				<TitleAndStatus>
					<Title>My GPS - Tracking</Title>

					<StatusConnection isActive={statusConnection}>
						{statusConnection? 'Online' : 'Offline'}
					</StatusConnection>
				</TitleAndStatus>
			</ConnectionStatusCard>

			<Separator />

			<ServiceStatus>
				<StatusTexts>
					<TextDark>Status do Serviço</TextDark>

					<TextLight>{isSwitchEnabled? 'Serviço ativo' : 'Serviço inativo'}</TextLight>
				</StatusTexts>

				<Switch 
					trackColor={{ 
						false: theme.colors.text_light, 
						true: theme.colors.text_light
					}}
					thumbColor={
						isSwitchEnabled ? theme.colors.enabled : theme.colors.header
					}
					ios_backgroundColor={theme.colors.text_light}
					onValueChange={toggleSwitch}
					value={isSwitchEnabled}
				/>
			</ServiceStatus>

			<IntervalSelection>
				<TextDark>Intervalo de comunicação</TextDark>

				<SelectButtons>
					<SelectButton
						value={10}
						isActive={connectionInterval === 10000? true : false}
						onPress={() => handleSelectInterval(10000)}
					/>

					<SelectButton
						value={5}
						isActive={connectionInterval === 5000? true : false}
						onPress={() => handleSelectInterval(5000)}
					/>

					<SelectButton
						value={3}
						isActive={connectionInterval === 3000? true : false}
						onPress={() => handleSelectInterval(3000)}
					/>

					<SelectButton
						value={1}
						isActive={connectionInterval === 1000? true : false}
						onPress={() => handleSelectInterval(1000)}
					/>
				</SelectButtons>	
			</IntervalSelection>
		</Container>
	)
}