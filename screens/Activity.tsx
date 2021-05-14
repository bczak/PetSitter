import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';


export default function ActivityScreen() {
	return (
		<View style={styles.container}>
			<Text>ACTIVITY </Text>
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
