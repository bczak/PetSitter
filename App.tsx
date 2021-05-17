import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigation from "./navigation";
import { ActivityIndicator, LogBox, StyleSheet } from "react-native";
import AuthNavigation from "./navigation/AuthNavigation";
import api from "./api";
import Theme from './constants/Theme'
import firebase from "firebase";
import { enableScreens } from 'react-native-screens';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
enableScreens();
LogBox.ignoreLogs(['Setting a timer'])
LogBox.ignoreLogs(['VirtualizedLists'])
LogBox.ignoreLogs(['Can\'t perform a React state update'])

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class App extends Component {
	state = { user: null, initializing: true }

	onAuthStateChanged(user: any) {
		this.setState(() => ({ user }));
		if (this.state.initializing) this.setState(() => ({ initializing: false }));
	}

	async componentDidMount() {
		api.fetchUser((user: firebase.User | null) => this.onAuthStateChanged(user));
	}

	render() {
		if (this.state.initializing) {
			return (<ActivityIndicator />)
		}
		if (this.state.user) {
			return (
				<PaperProvider theme={Theme}>
					<Navigation />
					<StatusBar style={'auto'} />
				</PaperProvider>
			);
		} else {
			return (
				<PaperProvider theme={Theme}>
					<AuthNavigation />
					<StatusBar style={'dark'} />
				</PaperProvider>
			)
		}
	}
}

const styles = StyleSheet.create({
	statusBar: {
		backgroundColor: 'red'
	}
})



