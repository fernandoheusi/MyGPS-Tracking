import React, { useEffect, useState } from 'react';

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
	const [uniqueIdsStatusArray,setUniqueIdsStatusArray] = useState<StatusProps[]>([]);

	function handleReturn(){
		navigation.navigate('Home');
	}

	useEffect(() => {
		const map = new Map();
		const uniqueIdStatusArray:StatusProps[] = [];

		const unique = (item:StatusProps) => {
			if(!map.has(item.id)){
				map.set(item.id, true);
				uniqueIdStatusArray.push({
					id: item.id,
					synchronous: item.synchronous,
					time: item.time
				})
			}
		}

		statusArray.forEach(unique);
		setUniqueIdsStatusArray(uniqueIdStatusArray);
	},[statusArray]);
	
	return(
		<Container>
			<Header>
				<HeaderButton title='Voltar' onPress={handleReturn}/>

				<Title>Status</Title>
			</Header>

			<StatusList 
				data={uniqueIdsStatusArray}
				keyExtractor={item => item.id}
				renderItem={({ item }) => <StatusCard data={item}/>}
				ItemSeparatorComponent={() => <Separator />}
			/>
		</Container>
	)
}