import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import * as React from 'react';

import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList} from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import AddPet from "../screens/AddPet";
import {Text, TouchableOpacity, View} from "react-native";

export default function Navigation() {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={DefaultTheme}>
			<RootNavigator/>
		</NavigationContainer>
	);
}

const Stack = createStackNavigator<RootStackParamList>();

function AddPetScreen({navigation, route}: StackScreenProps<RootStackParamList, 'AddPet'>) {
	return (<AddPet navigation={navigation} route={route}/>)
}

function RootNavigator() {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="Root" component={BottomTabNavigator}/>
			<Stack.Screen name="AddPet" component={AddPetScreen}/>
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
		</Stack.Navigator>
	);
}
