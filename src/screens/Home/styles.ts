import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface StatusConnectionProps{
	isActive: boolean;
}

export const Container = styled.View`
	flex: 1;

	background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
	width: 100%;
	margin-top: ${Platform.OS === 'ios'? getStatusBarHeight() : 0}px;
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
	flex-direction: row;
	height: ${RFValue(120)}px;
	padding: 0 38px;
`;

export const TitleAndStatus = styled.View`
	margin: 38px 0 35px 21px;
`;

export const Title = styled.Text`
	font-size: ${RFValue(18)}px;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.text_dark};
`;

export const StatusConnection = styled.Text<StatusConnectionProps>`
	font-size: ${RFValue(12)}px;
	color: ${({ theme,isActive }) => isActive? theme.colors.enabled : theme.colors.statusBar}
`;

export const ServiceStatus = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin: 37px 33px 46px;
`;

export const StatusTexts = styled.View``;

export const TextDark = styled.Text`
	font-size: ${RFValue(15)}px;
	color: ${({ theme }) => theme.colors.text_dark};
`;

export const TextLight = styled.Text`
	font-size: ${RFValue(13)}px;
	color: ${({ theme }) => theme.colors.text_light}
`;

export const IntervalSelection = styled.View`
	margin: 0 33px;
`;

export const SelectButtons = styled.View`
	flex-direction: row;
	justify-content: space-between;

	margin-top: 12px;
`;