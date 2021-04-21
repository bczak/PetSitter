import {Component} from "react";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import LinkingConfiguration from "./LinkingConfiguration";
import * as React from "react";
import NotFoundScreen from "../screens/NotFoundScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {AuthStackParamList} from "../types";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";

export default class AuthNavigation extends Component {
	render() {
		return (
			<NavigationContainer
				linking={LinkingConfiguration}
				theme={DefaultTheme}>
				<AuthNavigator/>
			</NavigationContainer>
		);
	}
}


const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen component={SignIn} name={"SignIn"}/>
			<Stack.Screen name="SignUp" component={SignUp}/>
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
		</Stack.Navigator>
	);
}