import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Switch } from 'react-native';
import * as TaskManager from 'expo-task-manager';
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

export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false);
	
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);

	const [packageArray,setPackageArray] = useState<PointsProps[]>([]);

	const {statusArray,setStatusArray} = useStatus();

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
	
const LOCATION_TASK_NAME = 'background-location-task';

const track = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
		console.log('to aqui');
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
			timeInterval: 1000,
			distanceInterval: 0
    });
  }
};


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data && isSwitchEnabled) {
    const { locations } = data;
    // do something with the locations captured in the background
    console.log(data);
  }
});

	useEffect(() => {
		track();
	},[]);

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