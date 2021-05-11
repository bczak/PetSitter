import React, {Component} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import Background from "../components/auth/Background";
import {Button, HelperText, Snackbar, TextInput} from "react-native-paper";
import Header from "../components/auth/Header";
import BackButton from "../components/auth/BackButton";
import {ScreenProps} from "../types";
import {emailValidator, passwordValidator} from "../utils";
import firebase from "../api";


export default class SignIn extends Component<ScreenProps, any> {
	readonly state = {
		email: {value: '', error: ''},
		password: {value: '', error: ''},
		snackbar: false,
		message: ''
	}

	async _onLoginPressed() {
		const emailError = emailValidator(this.state.email.value);
		const passwordError = passwordValidator(this.state.password.value);

		if (emailError || passwordError) {
			this.setState(() => ({email: {...this.state.email, error: emailError}}));
			this.setState(() => ({password: {...this.state.password, error: passwordError}}));
			return;
		}
		let status = await firebase.loginWithEmailAndPassword(this.state.email.value, this.state.password.value)
		console.log(status)
		if (status) {
			this.setState(() => ({snackbar: true, message: status}))
		} else {
			console.log('good')
		}
		// this.props.navigation.navigate('AuthHomeScreen');
	};

	onDismissSnackBar() {
		this.setState(() => ({snackbar: false, message: ''}))
	}

	render() {
		return (
			<Background>
				<BackButton goBack={() => this.props.navigation.navigate('AuthHomeScreen')}/>
				<View style={styles.main}>
					<Header>Welcome back</Header>
					<TextInput
						label="Email"
						mode={"outlined"}
						style={styles.input}
						returnKeyType="next"
						value={this.state.email.value}
						onChangeText={(text: string) => {
							this.setState(() => ({email: {value: text, error: ''}}))
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
						returnKeyType="done"
						mode={"outlined"}
						value={this.state.password.value}
						onChangeText={(text) => this.setState(() => ({password: {value: text, error: ''}}))}
						error={!!this.state.password.error}
						secureTextEntry
					/>
					<HelperText type="error" visible={this.state.password.error.length > 0}>
						{this.state.password.error}
					</HelperText>
					<Text onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')} style={styles.label}>
						Forgot your password?
					</Text>
					<Button mode="contained" style={styles.button} onPress={() => this._onLoginPressed()}>
						Login
					</Button>

					<View style={styles.row}>
						<Text style={styles.text} onPress={() => this.props.navigation.navigate('SignUpScreen')}>Don’t have an
							account?
							Sign Up</Text>
					</View>
				</View>
				<Snackbar
					style={styles.snackbar}
					visible={this.state.snackbar}
					duration={3000}
					onDismiss={() => this.onDismissSnackBar()}
					action={{
						label: 'Undo',
						onPress: () => this.onDismissSnackBar(),
					}}>
					{this.state.message}
				</Snackbar>
			</Background>
		);
	}
}


const styles = StyleSheet.create({
	main: {
		marginVertical: 200
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		textAlign: 'center',
		marginVertical: 20
	},
	input: {},
	button: {
	},
	snackbar: {
		position: 'absolute',
		bottom: 100,
		width: Dimensions.get('window').width - 15
	},
	text: {
		textAlign: 'center',
		width: '100%',
		fontWeight: 'bold',
		fontSize: 15
	},
	label: {
		textAlign: 'right',
		marginBottom: 20,
		flexGrow: 1,
		fontSize: 15,
		fontWeight: 'bold',
	},
});
