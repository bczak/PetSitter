import React, {Component, createRef, RefObject} from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	KeyboardAvoidingView,
	SafeAreaView
} from "react-native";
import {ScreenProps} from "../types";
import {Appbar, Button, Card, FAB, Modal, Portal, TextInput} from "react-native-paper";
import Carousel from "react-native-snap-carousel";
import DropdownPicker from "../components/home/DropdownPicker";
import {birds, cats, dogs} from "../constants/Breeds";
import * as ImagePicker from 'expo-image-picker';

const width = Dimensions.get('window').width

const genderTypes = [
	{value: 'male', label: 'Male'},
	{value: 'female', label: 'Female'},
	{value: 'other', label: 'Other'}]
const petTypes = [
	{value: 'dog', label: 'Dog'},
	{value: 'cat', label: 'Cat'},
	{value: 'bird', label: 'Bird'},
	{value: 'fish', label: 'Fish'},
	{value: 'rodent', label: 'Rodent'},
	{value: 'reptile', label: 'Reptile'},
	{value: 'other', label: 'Other'},
]

export default class AddPet extends Component<ScreenProps, any> {
	state = {
		images: [{image: require('../assets/images/dog_image_background.png'), default: true}],
		name: '',
		gender: 'male',
		type: 'dog',
		typeExpand: '',
		breed: 'test',
		otherBreed: '',
		imagePickerVisible: false
	}
	nameInputRef: RefObject<any> = createRef()
	typeExpandedRef: RefObject<any> = createRef()
	
	update(state: object) {
		this.setState(() => (state))
	}
	
	renderImage(data: any) {
		console.log(data)
		const image = (!data.item.default) ? {uri: data.item.image} : data.item.image
		return (
			<Image source={image} style={styles.image}/>
		);
	}
	
	getBreeds() {
		if (this.state.type !== 'other') {
			let breeds: Array<any>
			switch (this.state.type) {
				case 'dog':
					breeds = dogs.map((e: string) => ({value: e, label: e}))
					break;
				case 'cat':
					breeds = cats.map((e: string) => ({value: e, label: e}))
					break;
				case 'bird':
					breeds = birds.map((e: string) => ({value: e, label: e}))
					break;
				default:
					breeds = Array<any>()
					break;
			}
			breeds = [...breeds, {value: 'other', label: 'Other'}]
			return (
				<DropdownPicker label={"Breed"}
				                items={breeds}
				                selected={this.state.breed}
				                select={(value: string) => this.update({breed: value})}/>
			)
		}
	}
	
	expandType() {
		if (this.state.type === 'other') {
			return (
				<TextInput ref={this.typeExpandedRef}
				           value={this.state.typeExpand}
				           mode={'outlined'}
				           placeholder={"Snake"}
				           onChangeText={text => this.update({typeExpand: text})}/>)
		}
	}
	
	otherBreed() {
		if (this.state.breed === 'other') {
			return (
				<TextInput value={this.state.otherBreed}
				           mode={'outlined'}
				           onChangeText={text => this.update({otherBreed: text})}/>)
		}
	}
	
	async pickImageFromLibrary() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		})
		if (!result.cancelled) {
			this.update({images: [...this.state.images, result.uri]})
		}
	}
	
	async pickImageFromCamera() {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		})
		if (!result.cancelled) {
			f
			this.update({images: [...this.state.images, {image: result.uri}]})
		}
	}
	
	render() {
		
		return (
			<SafeAreaView style={{flex: 1}}>
				<Portal>
					<Modal visible={this.state.imagePickerVisible}
					       onDismiss={() => this.update({imagePickerVisible: false})}
					       contentContainerStyle={styles.modal}>
						<Card>
							<Card.Actions>
								<Button style={styles.modalButton} icon={'camera'} mode={'contained'}
								        onPress={() => this.pickImageFromCamera()}>Take new photo</Button>
							</Card.Actions>
							<Card.Actions>
								<Button style={styles.modalButton} icon={'image'} mode={'contained'}
								        onPress={() => this.pickImageFromLibrary()}>Select from Library</Button>
							</Card.Actions>
						</Card>
					</Modal>
				</Portal>
				<KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={0} enabled
				                      style={{flex: 1, alignItems: 'stretch'}}>
					<Appbar.Header>
						<Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
						<Appbar.Content title={"Pet Profile"} titleStyle={styles.appbar}/>
						<Appbar.Action icon={"check"}/>
					</Appbar.Header>
					<Carousel data={this.state.images}
					          renderItem={this.renderImage}
					          layout={'default'}
					          itemWidth={width}
					          sliderWidth={width}
					          sliderHeight={250}/>
					<FAB icon={'camera-plus'} style={styles.camera} onPress={() => this.update({imagePickerVisible: true})}/>
					<View style={styles.content}>
						<Text style={styles.contentTitle}>Information</Text>
						<Text style={styles.label}>Name</Text>
						<TextInput ref={this.nameInputRef}
						           value={this.state.name}
						           style={{marginTop: -6}}
						           mode={'outlined'}
						           placeholder={"Ghost"}
						           onChangeText={text => this.update({name: text})}/>
						<DropdownPicker selected={this.state.gender}
						                items={genderTypes}
						                label={"Gender"}
						                select={(value: string) => this.update({gender: value})}/>
						<DropdownPicker selected={this.state.type}
						                items={petTypes}
						                label={"Type"}
						                select={(value: string) => this.update({type: value})}/>
						{this.expandType()}
						{this.getBreeds()}
						{this.otherBreed()}
					</View>
				
				</KeyboardAvoidingView>
			
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	appbar: {
		textAlign: 'center'
	},
	label: {
		marginTop: 10,
		fontSize: 16,
		marginLeft: 2
	},
	image: {
		width: '100%',
		height: 250
	},
	modal: {
		marginHorizontal: '5%'
	},
	content: {
		padding: 15,
		marginBottom: 200,
	},
	camera: {
		position: 'absolute',
		right: 35,
		top: 310,
		backgroundColor: '#0088cc'
	},
	contentTitle: {
		fontWeight: 'bold',
		fontSize: 20
	},
	picker: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: 4,
		borderColor: 'gray',
		paddingVertical: 3,
		paddingHorizontal: 6,
	},
	modalButton: {
		width: '90%',
		marginHorizontal: '5%',
	}
});
