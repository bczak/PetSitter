import * as React from "react";

import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import ChatScreen from "../screens/Chat";
import ActivityScreen from "../screens/Activity";
import ProfileScreen from "../screens/Profile";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet } from "react-native";
import Theme from "../constants/Theme";
import api from "../api";
import { Request } from '../model'
import { useState } from "react";
const Tab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
	let [count, setCount] = useState(0);
	React.useEffect(() => {
		
		api.subscribeForRequests((request: Request[]) => {
			setCount(request.length)
		})
	})
	return (
		<Tab.Navigator
			barStyle={styles.bar}
			theme={Theme}
			initialRouteName="Home"
			shifting={true}
			sceneAnimationEnabled={true}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: "home",
				}}
			/>
			<Tab.Screen
				name="Search"
				component={SearchScreen}
				options={{
					tabBarIcon: "magnify",
				}}
			/>
			<Tab.Screen
				name="Pets"
				component={ChatScreen}
				options={{
					tabBarIcon: "delta",
				}}
			/>
			<Tab.Screen
				name="Notifications"
				component={ActivityScreen}

				options={{
					tabBarIcon: "bell",
					tabBarBadge: count > 0 ? count : undefined
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: "account",
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	bar: {
		height: 54,
		backgroundColor: Theme.colors.primary,
	},
});
