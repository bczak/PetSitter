import {StatusBar} from "expo-status-bar";
import React, {Component} from "react";

import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Navigation from "./navigation";
import {LogBox, Text, View} from "react-native";
import AuthNavigation from "./navigation/AuthNavigation";
import { auth } from "firebase";

LogBox.ignoreLogs(['Setting a timer'])


export default class App extends Component {
	state = {user: null, initializing: true}

	onAuthStateChanged(user: any) {
		this.setState(() => ({user}));
		if (this.state.initializing) this.setState(() => ({initializing: false}));
	}

	componentDidMount() {
		auth().onAuthStateChanged((user) => this.onAuthStateChanged(user)); // unsubscribe on unmount
	}

	render() {
		if (this.state.user) {
			return (
				<PaperProvider theme={DefaultTheme}>
					<Navigation/>
					<StatusBar/>
				</PaperProvider>
			);
		} else {
			return (
				<PaperProvider theme={DefaultTheme}>
					<AuthNavigation />
					<StatusBar/>
				</PaperProvider>
			)
		}
	}
}



