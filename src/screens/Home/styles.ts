import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize'

export const Container = styled.View`
	flex: 1;

	background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
	width: 100%;
	height: ${RFValue(68)}px;
	background-color: ${({ theme }) => theme.colors.header};

	flex-direction: row;
	padding: 22px;
	
	align-items: center;
	justify-content: space-between;
`;

export const Greeting = styled.Text`
	color: ${({ theme }) => theme.colors.background};
	opacity: 0.6;
`;

export const ConnectionStatusCard = styled.View`
	height: ${RFValue(120)}px;
`;

export const Title = styled.Text`
`;





