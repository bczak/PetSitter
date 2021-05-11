import React, {Component} from "react";
import {Text, StyleSheet, View} from "react-native";
import {ScreenProps} from "../types";
import {Appbar} from "react-native-paper";
import PetType from "./addPetSteps/PetType";
import PetBreed from "./addPetSteps/PetBreed";
import PetPhotos from "./addPetSteps/PetPhoto";
import api from "../api";
import {Pet} from "../model";


export default class AddPet extends Component<ScreenProps, any> {
	state = {
		activeStep: 0,
		nextStepAvailable: false,
		type: '',
		breed: '',
		birthday: new Date(),
		size: '',
		name: '',
		photos: []
	}
	
	prepareStep(data: any, field: string[]) {
		let visible = true;
		let change = {}
		for (let f of field) {
			change = {...change, [f]: data[f]}
			if (data[f]) {
				if (f === 'photos') {
					visible = visible && data[f].length > 0
				}
				visible = visible && true
			} else {
				visible = visible && false
			}
		}
		this.setState(() => ({nextStepAvailable: visible, ...change}))
	}
	
	prevStep() {
		if (this.state.activeStep == 0) {
			this.props.navigation.goBack()
		} else {
			this.setState(() => ({activeStep: this.state.activeStep - 1}))
		}
	}
	
	constructor(props: ScreenProps) {
		super(props);
		this.prevStep = this.prevStep.bind(this)
		this.prepareStep = this.prepareStep.bind(this)
	}
	
	async nextStep() {
		if (this.state.activeStep + 1 === 3) { // FIXME: 3 - count of steps
			console.log('process')
			// let pet: Pet = {
			// 	name: this.state.name,
			// 	type: this.state.type,
			// 	breed: this.state.breed,
			// }
			// await api.addPet(pet)
		} else {
			this.setState(() => ({activeStep: this.state.activeStep + 1, nextStepAvailable: false}))
		}
	}
	
	renderStep() {
		const steps = [
			{
				component: <PetType onData={(data: any) => this.prepareStep(data, ['type', 'name'])}
				                    data={{...this.state}}
				                    onPrev={() => this.prevStep()}/>,
				title: 'Name and Type'
			},
			{
				component: <PetBreed onData={(data: any) => this.prepareStep(data, ['breed', 'size', 'birthday'])}
				                     data={{...this.state}}
				                     onPrev={() => this.prevStep()}/>,
				title: 'Breed, Size and Birthday'
			},
			{
				component: <PetPhotos onData={(data: any) => this.prepareStep(data, ['photos'])}
				                      data={{...this.state}}
				                      onPrev={() => this.prevStep()}/>,
				title: 'Photos'
			},
		]
		
		return steps[this.state.activeStep]
	}
	
	render() {
		let step = this.renderStep()
		return (
			<View style={styles.container}>
				<Appbar.Header>
					<Appbar.BackAction onPress={() => this.prevStep()}/>
					<Appbar.Content title={step.title}/>
					{this.state.nextStepAvailable && <Appbar.Action icon={'check'} onPress={() => this.nextStep()}/>}
				</Appbar.Header>
				{step.component}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {},
});
