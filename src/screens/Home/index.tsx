<<<<<<< HEAD
import React, { 
	useEffect, 
	useState 
} from 'react';

import { Alert, Switch } from 'react-native';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
=======
import React, { useState } from 'react';
import { Switch } from 'react-native';
>>>>>>> BoasPraticas
import NetInfo from '@react-native-community/netinfo';
import { StackScreenProps } from '@react-navigation/stack';

import { HeaderButton } from '../../components/HeaderButton';
import { SelectButton } from '../../components/SelectButton';
import { Separator } from '../../components/Separator';

import Logo from '../../assets/logo.svg';

<<<<<<< HEAD
import { useStatus } from '../../contexts/statusContext';

import { StatusProps } from '../Status';
=======
import { StackScreenProps } from '@react-navigation/stack';
>>>>>>> BoasPraticas

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
import { useHome } from './hooks';

type Props = StackScreenProps<any,'Home'>;

<<<<<<< HEAD
interface PointsProps{
	id: string;
	latitude: number;
	longitude: number;
	speed: number;
	time: string;
}

export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false);
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);
	const [connectionInterval, setConnectionInterval] = useState(10);

	const {statusArray,setStatusArray} = useStatus();

	let trackInterval:NodeJS.Timer;
=======
export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false);

	const home = useHome();
>>>>>>> BoasPraticas

	NetInfo.addEventListener(state => {
			if (state.isConnected != statusConnection){setStatusConnection(state.isConnected!)}
	});

	const handleStatus = () => {
		navigation.navigate('Status');
	}

<<<<<<< HEAD
	const toggleSwitch = () => {
		setIsSwitchEnabled(state => !state);
	}

	const handleSelectInterval = (interval: 10 | 5 | 3 | 1) => {
		setConnectionInterval(interval);
	}

	const track = async() => {
		console.log("isSwitchEnabled: ",isSwitchEnabled);

		if (!isSwitchEnabled){
			clearInterval(trackInterval);
			return
		}

		const { status } = await Location.requestBackgroundPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Erro','Você não tem permissão para isso');
			return;
		}

		const location = await Location.getLastKnownPositionAsync({});
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
	};

	useEffect(() =>{
		const interval = connectionInterval * 1000;
		trackInterval = setInterval(track,interval);

		return (() => {
			clearInterval(trackInterval);
			console.log('limpei!');
		});
	});

=======
>>>>>>> BoasPraticas
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

					<TextLight>{home.isSwitchEnabled? 'Serviço ativo' : 'Serviço inativo'}</TextLight>
				</StatusTexts>

				<Switch 
					trackColor={{ 
						false: theme.colors.text_light, 
						true: theme.colors.text_light
					}}
					thumbColor={
						home.isSwitchEnabled ? theme.colors.enabled : theme.colors.header
					}
					ios_backgroundColor={theme.colors.text_light}
					onValueChange={home.toggleSwitch}
					value={home.isSwitchEnabled}
				/>
			</ServiceStatus>

			<IntervalSelection>
				<TextDark>Intervalo de comunicação</TextDark>

				<SelectButtons>
					<SelectButton
						value={10}
						isActive={home.connectionInterval === 10000? true : false}
						onPress={() => home.handleSelectInterval(10000)}
					/>

					<SelectButton
						value={5}
						isActive={home.connectionInterval === 5000? true : false}
						onPress={() => home.handleSelectInterval(5000)}
					/>

					<SelectButton
						value={3}
						isActive={home.connectionInterval === 3000? true : false}
						onPress={() => home.handleSelectInterval(3000)}
					/>

					<SelectButton
						value={1}
						isActive={home.connectionInterval === 1000? true : false}
						onPress={() => home.handleSelectInterval(1000)}
					/>
				</SelectButtons>	
			</IntervalSelection>
		</Container>
	)
}