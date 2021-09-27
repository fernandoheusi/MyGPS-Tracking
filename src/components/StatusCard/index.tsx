import React from 'react';
import { StatusProps } from '../../screens/Status';
import { Container, Id, Status, SynchronousStatus, Time } from './styles';

interface Props{
	data: StatusProps;
}

export function StatusCard({data}:Props){
	const {id,synchronous,time} = data;
	const cardDate = new Date(time);

	return(
		<Container>
			<Status>
				<Id>Pacote ID: {id}</Id>

				<SynchronousStatus>{synchronous? 'Sincronizado' : 'Pendente sincronizar'}</SynchronousStatus>
			</Status>

			<Time>{`${cardDate.getHours()}:${cardDate.getMinutes()}:${cardDate.getSeconds()}`}</Time>
		</Container>
	)
}