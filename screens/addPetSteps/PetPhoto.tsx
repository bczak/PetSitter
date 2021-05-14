import React, { Component } from "react";
import { StepProps } from "../../types";
import { Dimensions, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import { Button, IconButton, Snackbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getStatusBarHeight } from "react-native-status-bar-height";

const width = Dimensions.get("window").width;

export default class PetPhotos extends Component<StepProps, any> {
	state = {
		photos: [],
		snackbar: false,
		snackBarText: "",
		selected: 0,
	};

	componentDidMount() {
		if (this.props.data.photos.length > 0) {
			this.props.onData({ photos: [...this.props.data.photos] });
		}
	}

	constructor(props: StepProps) {
		super(props);
		this.renderImage = this.renderImage.bind(this);
	}

	showInfo() {
		this.setState(() => ({ snackbar: true, snackBarText: "Long tap to remove" }));
	}

	remove(index: number) {
		let photos = [...this.props.data.photos];
		photos.splice(index, 1);
		this.props.onData({ photos });
		this.setState(() => ({ snackbar: true, snackBarText: "Removed" }));
	}

	renderImage({ index, item }: any) {
		return (
			<TouchableOpacity activeOpacity={0.95} onPress={() => this.showInfo()} onLongPress={() => this.remove(index)}>
				<Image source={{ uri: item }} style={styles.image} />
			</TouchableOpacity>
		);
	}

	async openCamera() {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.3,
		});
		if (!result.cancelled) {
			this.props.onData({ photos: [...this.props.data.photos, result.uri] });
		}
	}

	async openGallery() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.3,
		});
		console.log(result);
		if (!result.cancelled) {
			this.props.onData({ photos: [...this.props.data.photos, result.uri] });
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this.props.data.photos.length > 0 && <Button
					children={this.state.selected + 1 + " of " + this.props.data.photos.length}
					mode="outlined"
					style={styles.indicator}
				/>}
				<Carousel
					data={this.props.data.photos}
					renderItem={this.renderImage}
					layout={"default"}
					onSnapToItem={(index) => this.setState(() => ({ selected: index }))}
					itemWidth={width}
					sliderWidth={width}
					sliderHeight={250}
				/>
				<Button style={styles.button} icon={"camera"} mode={"contained"} onPress={() => this.openCamera()}>
					Take photo from camera
				</Button>
				<Button style={styles.button} icon={"image"} mode={"contained"} onPress={() => this.openGallery()}>
					Pick photo from gallery
				</Button>
				<Snackbar
					visible={this.state.snackbar}
					style={styles.snackbar}
					onDismiss={() => this.setState(() => ({ snackbar: false }))}
					duration={2000}
				>
					{this.state.snackBarText}
				</Snackbar>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		flexDirection: 'column',
		justifyContent: "flex-start",
		alignContent: "flex-start"
	},
	image: {
		width: "100%",
		height: width,
	},
	button: {
		marginTop: 10,
		marginHorizontal: 10,
	},
	snackbar: {
		position: "absolute",
		bottom: getStatusBarHeight(),
		left: 0,
	},
	indicator: {
		position: "absolute",
		top: 350 - 12,
		right: 16,
		zIndex: 999,
		backgroundColor: "white",
		borderRadius: 50,
	},
});
