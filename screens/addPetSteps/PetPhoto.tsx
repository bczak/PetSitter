import React, {Component} from "react";
import {StepProps} from "../../types";
import {Dimensions, StyleSheet, View, Image, TouchableOpacity} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Button, Snackbar} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

const width = Dimensions.get('window').width

export default class PetPhotos extends Component<StepProps, any> {
	state = {
		photos: [],
		snackbar: false,
		snackBarText: ''
	}
	
	constructor(props: StepProps) {
		super(props);
		this.renderImage = this.renderImage.bind(this)
	}
	
	showInfo() {
		this.setState(() => ({snackbar: true, snackBarText: 'Long tap to remove'}))
	}
	
	remove(index: number) {
		let photos = [...this.props.data.photos]
		photos.splice(index, 1)
		this.props.onData({photos})
		this.setState(() => ({snackbar: true, snackBarText: 'Removed'}))
	}
	
	renderImage({index, item}: any) {
		return (
			<TouchableOpacity activeOpacity={0.95} onPress={() => this.showInfo()} onLongPress={() => this.remove(index)}>
				<Image source={{uri: item}} style={styles.image}/>
			</TouchableOpacity>
		);
	}
	
	async openCamera() {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		})
		if (!result.cancelled) {
			this.props.onData({photos: [...this.props.data.photos, result.uri]})
		}
	}
	
	async openGallery() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		})
		if (!result.cancelled) {
			this.props.onData({photos: [...this.props.data.photos, result.uri]})
		}
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Carousel data={this.props.data.photos}
				          renderItem={this.renderImage}
				          layout={'default'}
				          itemWidth={width}
				          sliderWidth={width}
				          sliderHeight={250}/>
				<Button style={styles.button} icon={'camera'} mode={'contained'} onPress={() => this.openCamera()}>
					Take photo from camera
				</Button>
				<Button style={styles.button} icon={'image'} mode={'contained'} onPress={() => this.openGallery()}>
					Pick photo from gallery
				</Button>
				<Snackbar
					visible={this.state.snackbar}
					style={styles.snackbar}
					onDismiss={() => this.setState(() => ({snackbar: false}))}
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
		position: 'relative'
	},
	image: {
		width: '100%',
		height: width
	},
	button: {
		marginTop: 10,
		marginHorizontal: 10,
	},
	snackbar: {
		position: 'absolute',
	}
	
});
