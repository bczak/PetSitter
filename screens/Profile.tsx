import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Appbar, Avatar, Button, Headline, Menu, Snackbar, TextInput } from 'react-native-paper';
import api from '../api';
import { User } from '../model';
import { ScreenProps } from '../types';

export default function ProfileScreen(props: ScreenProps) {
	const [owner, setOwner] = React.useState({} as User)
	const [name, setName] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [showPassword, setShowPassword] = React.useState(false)
	const [snackbar, setSnackbar] = React.useState('')
	React.useEffect(() => {
		api.getUser(api.user?.uid || '').then((user) => {
			setOwner(user)
			setName(user.displayName)
		})
	}, [props.navigation])


	const save = async () => {
		try {
			await api.changeName(name)
			await api.changePassword(password)
			setSnackbar('Saved!')
		} catch (e) {			
			setSnackbar('Error: ' + e.message)
		}
	}

	return (
		<View style={styles.container}>
			<Snackbar visible={snackbar.length > 0} style={styles.snackbar} onDismiss={() => setSnackbar('')}>{snackbar}</Snackbar>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Profile Settings" />
			</Appbar.Header>
			<View style={styles.descriptionOwner}>
				<TextInput style={styles.input} mode='outlined' label='Name' placeholder='First and last name' value={owner.displayName}
					onChangeText={(text: string) => setName(text)} />
				<TextInput style={styles.input} mode='outlined' secureTextEntry={!showPassword} right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} name={showPassword ? 'eye' : 'eye-off'} />} label='New Password' placeholder='New password' value={password} onChangeText={(text: string) => setPassword(text)} />
				<Button mode='contained' style={{ marginVertical: 4 }} onPress={save}>Save</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		width: Dimensions.get('screen').width - 20,
		marginVertical: 4
	},
	container: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	descriptionOwner: {
		padding: 10,
	},
	snackbar: {

	},
	avatarText: {
		width: 75,
		height: 75,
		borderRadius: 12,
	},

	header: {
		width: '100%'
	},
	box: {
		flex: 1,
		marginLeft: 30,
		flexDirection: "column",
		height: 100,
	},

	name: {
		fontSize: 26,
		fontWeight: "600",
	},
});
