import React from 'react';

import { HeaderButton } from '../../components/HeaderButton';
import { StatusCard } from '../../components/StatusCard';
import { Separator } from '../../components/Separator';

import { useStatus } from '../../contexts/statusContext';

import { StackScreenProps } from '@react-navigation/stack';

import { 
	Container, 
	Header, 
	StatusList, 
	Title 
} from './styles';

type Props = StackScreenProps<any,'Stack'>;

export interface StatusProps{
	id: string;
	synchronous: boolean;
	time: Date;
}

export function Status({navigation}:Props){
	const {statusArray} = useStatus();
	
	function handleReturn(){
		navigation.navigate('Home');
	}
	
	return(
		<Container>
			<Header>
				<HeaderButton title='Voltar' onPress={handleReturn}/>

				<Title>Status</Title>
			</Header>

			<StatusList 
				data={statusArray}
				keyExtractor={item => item.id}
				renderItem={({ item }) => <StatusCard data={item}/>}
				ItemSeparatorComponent={() => <Separator />}
			/>
		</Container>
	)
}