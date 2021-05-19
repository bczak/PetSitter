import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text } from 'react-native-paper'
import api from '../api'
import { Pet, Review } from '../model'
import { ScreenProps, } from '../types'


export default function Reviews(props: ScreenProps) {

	const [pet, setPet] = React.useState({} as Pet)
	const [reviews, setReviews] = React.useState([] as Review[])
	React.useEffect(() => {
		(async () => {
			const id = props.route.params?.id || null
			if (id === null) props.navigation.navigate('Home')
			setPet(await api.getPet(id) || {} as Pet)
			
		})()
	})

	return (<View>
		<Appbar.Header style={styles.header}>
			<Appbar.BackAction onPress={() => props.navigation.goBack()} />
			<Appbar.Content title={pet.name} />
		</Appbar.Header>
	</View>)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		width: "100%",
	}
});
