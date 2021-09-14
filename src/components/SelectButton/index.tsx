import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { TouchableOpacityProps } from 'react-native';
import {
	Container, 
	Title
} from './styles';

interface Props extends TouchableOpacityProps {
	value: 10 | 5 | 3 | 1;
	isActive: boolean;
};

export function SelectButton({ value,isActive, ...rest}: Props){
	return(
		<Container isActive={isActive} {...rest}>
			<Title>
				{value}s
			</Title>
		</Container>
	)
}