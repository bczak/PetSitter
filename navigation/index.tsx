import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import * as React from "react";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import AddPet from "../screens/AddPet";

export default function Navigation() {
	return (
		<NavigationContainer theme={DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}

const Stack = createStackNavigator();
function RootNavigator() {
	return (
		<Stack.Navigator headerMode='none'>
			<Stack.Screen name="App" component={BottomTabNavigator} />
			<Stack.Screen name="AddPet" component={AddPet} />
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
		</Stack.Navigator>
	);
}
