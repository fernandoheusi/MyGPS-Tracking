import React from 'react';
import { Container, Text } from './styles';
import {RectButtonProps} from 'react-native-gesture-handler';

interface Props extends RectButtonProps{
	title: string;
	onPress: () => void;
}

export function HeaderButton({
	title,
	onPress,
	...rest
}:Props){
	return(
		<Container onPress={onPress} {...rest}>
			<Text>
				{title}
			</Text>
		</Container>
	)
}