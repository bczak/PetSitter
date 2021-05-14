import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export function Loader({ status }) {
	return (
		status && (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
			</View>
		)
	);
}
export const MemoizedLoader = React.memo(Loader)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 0,
		left: 0,
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		zIndex: 999,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
});
