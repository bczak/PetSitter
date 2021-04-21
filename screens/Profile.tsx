import * as React from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';

export default function ProfileScreen() {
	return (
		<View style={styles.container}>
			<Text>PROFILE </Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
