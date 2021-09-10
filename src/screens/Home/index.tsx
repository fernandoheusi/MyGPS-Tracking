import React from 'react';
import { HeaderButton } from '../../components/HeaderButton';
import { Separator } from '../../components/Separator';
// import {Logo} from '../../assets/Logo.svg';
import { ConnectionStatusCard, Container, Greeting, Header, Title } from './styles';

export function Home(){
	
	function handleStatus(){
		return null
	}
	
	return(
		<Container>
			<Header>
				<Greeting>Olá, bem-vindo</Greeting>

				<HeaderButton title='Status' onPress={handleStatus}/>
			</Header>

			<ConnectionStatusCard>
				{/* <Logo /> */}
			</ConnectionStatusCard>

			<Separator />
			<Title>Home</Title>
		</Container>
	)
}