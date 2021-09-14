import styled from 'styled-components/native';
import { FlatList, Platform } from 'react-native';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusProps } from '.';

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
`;

export const Title = styled.Text`
	position: absolute;
	align-self: center;
	margin-left: 50%;
	color: ${({ theme }) => theme.colors.background};
	opacity: 0.6;
`;

export const StatusList = styled(
	FlatList as new () => FlatList<StatusProps>
).attrs({
	showsVerticalScrollIndicator: false,
	marginTop: 26,
	contentContainerStyle: {
		paddingBottom: getBottomSpace(),
		paddingHorizontal: 33
	}
})`
`;