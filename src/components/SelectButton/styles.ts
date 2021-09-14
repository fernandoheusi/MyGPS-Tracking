import styled, {css} from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface ContainerProps {
	isActive: boolean;
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
	width: 23%;

	flex-direction: row;
	align-items: center;
	justify-content: center;
	
	border-width: 2px;
	border-style: solid;
	border-radius: 5px;

	padding: 22px;

	${({ isActive }) => isActive ? 
		css`border-color: ${({ theme }) => theme.colors.enabled};`
		:css`border-color: ${({ theme }) => theme.colors.text_light};`  
	};
`;

export const Title = styled.Text`
	font-size: 14px;
`;