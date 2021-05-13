import React, { Component } from "react";
import Background from "../components/auth/Background";
import Header from "../components/auth/Header";
import { Avatar, Button, Divider, Paragraph, Text } from "react-native-paper";
import { ScreenProps } from "../types";
import { StyleSheet, View } from "react-native";

export default class AuthHome extends Component<ScreenProps, any> {
	render() {
		return (
			<Background>
				<View style={styles.container}>
					<Header>Pet Sitter</Header>

					<Text style={styles.label}>The easiest way to walk with pets by not having them</Text>
					<View style={styles.group}>
						<Button
							style={styles.button}
							mode="contained"
							onPress={() => this.props.navigation.navigate("SignInScreen")}
						>
							Sign In
						</Button>
						<Button
							style={styles.button}
							mode="outlined"
							onPress={() => this.props.navigation.navigate("SignUpScreen")}
						>
							Sign Up
						</Button>
					</View>
					<Divider style={styles.divider} />
					<Button
						icon={"google"}
						style={styles.google}
						mode="outlined"
						color={"white"}
						onPress={() => console.log("google")}
					>
						Google
					</Button>
				</View>
			</Background>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 200,
	},
	label: {
		fontSize: 18,
		textAlign: "center",
	},
	button: {
		marginTop: 20,
		marginHorizontal: "5%",
		width: "40%",
	},
	divider: {
		marginVertical: 20,
	},
	google: {
		marginTop: 0,
		marginHorizontal: "5%",
		backgroundColor: "#de5246",
	},
	group: {
		flexDirection: "row",
	},
});
