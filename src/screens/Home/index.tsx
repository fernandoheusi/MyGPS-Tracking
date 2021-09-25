import React, { useState } from 'react';
import { Switch } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { HeaderButton } from '../../components/HeaderButton';
import { SelectButton } from '../../components/SelectButton';
import { Separator } from '../../components/Separator';

import Logo from '../../assets/logo.svg';

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
import { useTracking } from '../../services/geoLocation';

type Props = StackScreenProps<any,'Home'>;

export function Home({navigation}:Props){
	const [statusConnection,setStatusConnection] = useState(false);

	const track = useTracking();

	NetInfo.addEventListener(state => {
			if (state.isConnected != statusConnection){setStatusConnection(state.isConnected!)}
	});

	function handleStatus(){
		navigation.navigate('Status');
	}

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

					<TextLight>{track.isSwitchEnabled? 'Serviço ativo' : 'Serviço inativo'}</TextLight>
				</StatusTexts>

				<Switch 
					trackColor={{ 
						false: theme.colors.text_light, 
						true: theme.colors.text_light
					}}
					thumbColor={
						track.isSwitchEnabled ? theme.colors.enabled : theme.colors.header
					}
					ios_backgroundColor={theme.colors.text_light}
					onValueChange={track.toggleSwitch}
					value={track.isSwitchEnabled}
				/>
			</ServiceStatus>

			<IntervalSelection>
				<TextDark>Intervalo de comunicação</TextDark>

				<SelectButtons>
					<SelectButton
						value={10}
						isActive={track.connectionInterval === 10000? true : false}
						onPress={() => track.handleSelectInterval(10000)}
					/>

					<SelectButton
						value={5}
						isActive={track.connectionInterval === 5000? true : false}
						onPress={() => track.handleSelectInterval(5000)}
					/>

					<SelectButton
						value={3}
						isActive={track.connectionInterval === 3000? true : false}
						onPress={() => track.handleSelectInterval(3000)}
					/>

					<SelectButton
						value={1}
						isActive={track.connectionInterval === 1000? true : false}
						onPress={() => track.handleSelectInterval(1000)}
					/>
				</SelectButtons>	
			</IntervalSelection>
		</Container>
	)
}