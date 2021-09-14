import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '../screens/Home';
import { Status } from '../screens/Status';


const {Navigator,Screen} = createStackNavigator();

export function AppRoutes(){
	return(
			<Navigator
				screenOptions={{headerShown: false}}
			>
				<Screen name='Home' component={Home}/>
				<Screen name='Status' component={Status}/>
			</Navigator>
	)
}