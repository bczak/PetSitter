import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import NotFoundScreen from "../screens/NotFoundScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AddPet from "../screens/AddPet";
import Pet from "../screens/Pet";

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
			<Stack.Screen name="Pet" component={Pet} />
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
		</Stack.Navigator>
	);
}
