import React, { Component } from "react";
import { StepProps } from "../../types";
import { Dimensions, StyleSheet, View, Text} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getStatusBarHeight } from "react-native-status-bar-height";
import * as Location from "expo-location";

export default class PetLocation extends Component<StepProps, any> {
	state = {
		markerData: {
			latitude: 50.07,
			longitude: 14.41,
		},
		mapData: {
			latitude: 50.07,
			longitude: 14.41,
			latitudeDelta: 0.2,
			longitudeDelta: 0.2,
		},
	};

	componentDidMount() {
		(async () => {
			let status = await Location.requestPermissionsAsync();
			if (status.granted) {
				let location = await Location.getCurrentPositionAsync({});
				console.log(location);
			} else {
				console.log(status);
			}
		})();
	}

	handleRegionChange(mapData: any) {
		this.setState({
			markerData: { latitude: mapData.latitude, longitude: mapData.longitude },
			mapData,
		});
		this.props.onData({ location: mapData });
	}

	render() {
		return (
			<View>
				<MapView
					style={styles.map}
					showsMyLocationButton={true}
					showsCompass={true}
					region={this.state.mapData}
					zoomEnabled
					rotateEnabled={false}
					onRegionChangeComplete={(data) => this.handleRegionChange(data)}
				>
					<Circle
						center={this.state.markerData}
						radius={2000}
						strokeColor={"rgba(0,0,0,0)"}
						fillColor={"rgba(0,0,0,0)"}
					/>
				</MapView>
				<View style={styles.circle}></View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	map: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("window").height - getStatusBarHeight() - 50,
	},
	circle: {
		width: 100,
		height: 100,
		borderWidth: 1,
		borderRadius: 100,
		borderStyle: "solid",
		borderColor: "#0088cc",
		backgroundColor: 'rgba(0,136, 204, 0.3)',
		position: "absolute",
		top: (Dimensions.get('window').height - getStatusBarHeight()) / 2 - 50,
		left: Dimensions.get('window').width / 2 - 50,
	},
});
