import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Switch } from 'react-native';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import NetInfo from '@react-native-community/netinfo';

import { HeaderButton } from '../../components/HeaderButton';
import { SelectButton } from '../../components/SelectButton';
import { Separator } from '../../components/Separator';

import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';

import { useStatus } from '../../contexts/statusContext';

import { StackScreenProps } from '@react-navigation/stack';
import { StatusProps } from '../Status';

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

interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

let trackInterval:NodeJS.Timer;

let enabled = false;
function getEnabled(){
	return enabled;
}

let array:PointsProps[] = [];
function getArray(){
	return array;
}

let pointStatus:StatusProps[] = [];
function getStatus(){
	return pointStatus;
}

export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false);
	
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	enabled = isSwitchEnabled;

	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);
	array = packageArray;

	const {statusArray,setStatusArray} = useStatus();
	pointStatus = statusArray;

	const [connectionInterval, setConnectionInterval] = useState(10);

	NetInfo.addEventListener(state => {
			if (state.isConnected != statusConnection){setStatusConnection(state.isConnected!)}
	});

	function handleStatus(){
		navigation.navigate('Status');
	}

	function toggleSwitch(){
		setIsSwitchEnabled(state => !state);
	}

	function handleSelectInterval(interval: 10 | 5 | 3 | 1){
		setConnectionInterval(interval);
	}
	
	async function track(){
		array = getArray();
		enabled = getEnabled();
		pointStatus = getStatus();

		if (enabled == false){
			clearInterval(trackInterval);
			return
		}

		let { status } = await Location.requestBackgroundPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Erro','Você não tem permissão para isso');
			return;
		}

		let location = await Location.getLastKnownPositionAsync({});
		let date = new Date(location!.timestamp);
		let time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

		let locationFormated = {
			id: `${date.getTime()}`,
			latitude: location!.coords.latitude,
			longitude: location!.coords.longitude,
			speed: location!.coords.speed!,
			time
		}

		let packageAtualized = [
			...array,
			locationFormated
		]

		setPackageArray(packageAtualized);

		let pointStatusFormated = {
			id: locationFormated.id,
			synchronous: false,
			time: date
		}

		let pointsAtualized = [
			pointStatusFormated,
			...pointStatus
		]

		setStatusArray(pointsAtualized);

		function updateStates(){
			let pointsSynchronized = pointStatus.map(item => {
				item.synchronous = true
				return item
			});
			setStatusArray(pointsSynchronized);
			setPackageArray([]);
		}

			try {
				const date = new Date();
				const id = String(date.getTime());
				const response = await api.post(`/points/${id}`,array);
				console.log('id: ',id)
				console.log('arraySuccess: ',array);

				if(response) {updateStates()};

				console.log('response: ',response.data.status);
			} catch (error) {
				console.log(error);
				console.log('arrayError: ',array);
			}
			
			console.log("connectionInterval: ",connectionInterval);
			return
	};

	useEffect(() =>{
		clearInterval(trackInterval);
		
		const interval = connectionInterval * 1000;
		trackInterval = setInterval(track,interval);
	},[isSwitchEnabled,connectionInterval]);


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
						isActive={connectionInterval === 10? true : false}
						onPress={() => handleSelectInterval(10)}
					/>

					<SelectButton
						value={5}
						isActive={connectionInterval === 5? true : false}
						onPress={() => handleSelectInterval(5)}
					/>

					<SelectButton
						value={3}
						isActive={connectionInterval === 3? true : false}
						onPress={() => handleSelectInterval(3)}
					/>

					<SelectButton
						value={1}
						isActive={connectionInterval === 1? true : false}
						onPress={() => handleSelectInterval(1)}
					/>
				</SelectButtons>	
			</IntervalSelection>
		</Container>
	)
}