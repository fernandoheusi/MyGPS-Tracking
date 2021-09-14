import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
	flex-direction: row;
	justify-content: space-between;

	padding: 18px 0;
`;

export const Status = styled.View`
`;

export const Id = styled.Text`
	font-size: ${RFValue(13)}px;
	margin-bottom: 15px;
`;

export const SynchronousStatus = styled.Text`
	font-size: ${RFValue(12)}px;
`;

export const Time = styled.Text`
	font-size: ${RFValue(12)}px;
	color: ${({ theme }) => theme.colors.text_light};
`;

