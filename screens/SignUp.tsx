import React, { Component } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import BackButton from "../components/auth/BackButton";
import Header from "../components/auth/Header";
import { Button, HelperText, TextInput, Snackbar } from "react-native-paper";
import Background from "../components/auth/Background";
import { ScreenProps } from "../types";
import { emailValidator, passwordValidator } from "../utils";
import api from "../api";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default class SignUp extends Component<ScreenProps, any> {
	ref = {
		name: null,
		email: null,
		password: null,
	};
	state = {
		email: {
			value: "tashpulatov.jakhongir@gmail.com",
			error: "",
		},
		name: {
			value: "Jakhongir Tashpulatov",
			error: "",
		},
		password: {
			value: "test1234",
			error: "",
			show: false,
		},
		snackbar: {
			visible: false,
			message: "",
		},
	};

	validate() {
		if (this.state.name.value.length == 0) {
			this.setState(() => ({
				name: { ...this.state.name, error: "Name must not be empty" },
			}));
			// @ts-ignore
			this.ref.name.focus();
			return false;
		}
		let validEmail = emailValidator(this.state.email.value);
		if (validEmail.length > 0) {
			this.setState(() => ({
				email: { value: this.state.email.value, error: validEmail },
			}));

			// @ts-ignore
			this.ref.email.focus();
			return false;
		}
		let validPassword = passwordValidator(this.state.password.value);
		if (validPassword.length > 0) {
			this.setState(() => ({
				password: { ...this.state.password, error: validPassword },
			}));
			// @ts-ignore
			this.ref.password.focus();
			return false;
		}
		return true;
	}

	blur() {
		// @ts-ignore
		this.ref.password.blur();
		// @ts-ignore
		this.ref.email.blur();
		// @ts-ignore
		this.ref.name.blur();
	}

	async _onSignUpPressed() {
		if (this.validate()) {
			this.blur();
			let message = await api.createUser(this.state.name.value, this.state.email.value, this.state.password.value);
			if (message !== null) {
				console.log(message);
				this.setState(() => ({ snackbar: { visible: true, message: message } }));
			}
		}
	}

	onDismissSnackBar() {
		this.setState(() => ({ snackbar: false, message: "" }));
	}

	render() {
		return (
			<Background>
				<KeyboardAvoidingView style={styles.main} behavior="position">
					<Header>Welcome, new user!</Header>
					<TextInput
						ref={(input: any) => (this.ref.name = input)}
						label="First and last name"
						onSubmitEditing={() => {
							// @ts-ignore
							this.ref.email.focus();
						}}
						returnKeyType="done"
						blurOnSubmit
						right={<TextInput.Icon name={this.state.name.error.length > 0 ? "alert-circle" : ""} color="#b00020" />}
						mode={"outlined"}
						value={this.state.name.value}
						onChangeText={(text) => this.setState(() => ({ name: { ...this.state.name, value: text, error: "" } }))}
						error={!!this.state.name.error}
					/>
					<HelperText type="error" visible={this.state.name.error.length > 0}>
						{this.state.name.error}
					</HelperText>
					<TextInput
						ref={(input: any) => (this.ref.email = input)}
						label="Email"
						mode={"outlined"}
						style={styles.input}
						onSubmitEditing={() => {
							// @ts-ignore
							this.ref.password.focus();
						}}
						returnKeyType="next"
						blurOnSubmit
						right={<TextInput.Icon name={this.state.email.error.length > 0 ? "alert-circle" : ""} color="#b00020" />}
						value={this.state.email.value}
						onChangeText={(text: string) => {
							this.setState(() => ({ email: { ...this.state.email, value: text, error: "" } }));
						}}
						error={!!this.state.email.error}
						autoCapitalize="none"
						autoCompleteType="email"
						textContentType="emailAddress"
						keyboardType="email-address"
					/>
					<HelperText type="error" visible={this.state.email.error.length > 0}>
						{this.state.email.error}
					</HelperText>
					<TextInput
						label="Password"
						ref={(input: any) => (this.ref.password = input)}
						returnKeyType="done"
						mode={"outlined"}
						blurOnSubmit
						autoCompleteType={"off"}
						right={
							<TextInput.Icon
								name={this.state.password.show ? "eye" : "eye-off"}
								onPress={() =>
									this.setState(() => ({
										password: {
											...this.state.password,
											show: !this.state.password.show,
										},
									}))
								}
							/>
						}
						value={this.state.password.value}
						onChangeText={(text) =>
							this.setState(() => ({ password: { ...this.state.password, value: text, error: "" } }))
						}
						error={!!this.state.password.error}
						secureTextEntry={!this.state.password.show}
					/>

					<HelperText type="error" visible={this.state.password.error.length > 0}>
						{this.state.password.error}
					</HelperText>

					<Button mode="contained" style={styles.button} onPress={() => this._onSignUpPressed()}>
						Sign Up
					</Button>

					<View style={styles.row}>
						<Text style={styles.text} onPress={() => this.props.navigation.navigate("SignInScreen")}>
							Already have an account? Sign In
						</Text>
					</View>
					<Snackbar
						style={styles.snackbar}
						visible={this.state.snackbar.visible}
						duration={5000}
						action={{
							label: "OK",
						}}
						onDismiss={() => this.setState(() => ({ snackbar: { visible: false, message: "" } }))}
					>
						{this.state.snackbar.message}
					</Snackbar>
				</KeyboardAvoidingView>
			</Background>
		);
	}
}

const styles = StyleSheet.create({
	main: {
		paddingTop: "20%",
	},
	row: {
		display: "flex",
		flexDirection: "row",
		textAlign: "center",
		marginVertical: 20,
	},
	input: {},
	button: {},
	snackbar: {
		position: "absolute",
		bottom: -80,
		left: -20,
		width: Dimensions.get("screen").width - 16,
	},
	text: {
		textAlign: "center",
		width: "100%",
		fontWeight: "bold",
		fontSize: 15,
	},
	label: {
		textAlign: "right",
		marginBottom: 20,
		fontSize: 15,
		fontWeight: "bold",
	},
});
