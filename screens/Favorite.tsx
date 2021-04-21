import * as React from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {Appbar, Button} from "react-native-paper";
import {ScreenProps} from "../types";

export default function FavoriteScreen(props: ScreenProps) {
	return (
		<View style={styles.container}>
			<Appbar.Header>
				<Appbar.Content title="Favorites"/>
				<Appbar.Action icon={'heart-outline'} onPress={() => {
					console.log('favorite')
				}}/>
			</Appbar.Header>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {}
});
