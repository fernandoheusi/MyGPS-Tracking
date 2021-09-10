import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(RectButton)`
	align-items: center;
`;

export const Text = styled.Text`
	font-size: ${RFValue(14)}px;
	color: ${({ theme }) => theme.colors.background};
`;


