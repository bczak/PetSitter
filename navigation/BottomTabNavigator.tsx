import * as React from "react";

import HomeScreen from "../screens/Home";
import SearchScreen from "../screens/Search";
import ChatScreen from "../screens/Chat";
import ActivityScreen from "../screens/Activity";
import ProfileScreen from "../screens/Profile";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet } from "react-native";
import Theme from "../constants/Theme";

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
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
				name="Chat"
				component={ChatScreen}
				options={{
					tabBarIcon: "chat",
				}}
			/>
			<Tab.Screen
				name="Activity"
				component={ActivityScreen}
				options={{
					tabBarIcon: "bell",
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
