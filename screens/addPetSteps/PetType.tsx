import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView, KeyboardAvoidingView} from "react-native";
import {StepProps} from "../../types";
import {Avatar, Card, IconButton, TextInput} from "react-native-paper";

export default class PetType extends Component<StepProps, any> {
	state = {
		type: '',
		selected: '',
		name: '',
		other: false
	}
	private types = [
		{color: '#880e4f', icon: 'dog', label: 'Dog', type: 'dog'},
		{color: '#b71c1c', icon: 'cat', label: 'Cat', type: 'cat'},
		{color: '#4a148c', icon: 'rodent', label: 'Rodent', type: 'rodent'},
		{color: '#1a237e', icon: 'food-drumstick', label: 'Bird', type: 'bird'},
		{color: '#0277bd', icon: 'fish', label: 'Fish', type: 'fish'},
		{color: '#00695c', icon: 'tortoise', label: 'Reptile', type: 'reptile'},
		{color: '#33691e', icon: 'rabbit', label: 'Rabbit', type: 'rabbit'},
		{color: '#3e2723', icon: 'paw', label: 'Other', type: 'other'}
	]
	private flatTypes = this.types.map((e) => e.type).filter(i => i !== 'other')
	
	constructor(props: StepProps) {
		super(props);
		this.renderType = this.renderType.bind(this)
	}
	
	private static getIcon(item: any, selected: boolean) {
		return <Avatar.Icon style={{backgroundColor: item.color}}
		                    icon={selected ? 'check' : item.icon}
		                    size={40}/>
	}
	
	componentDidMount() {
		this.update(this.props.data.name, this.props.data.type)
		this.setState(() => ({type: this.props.data.type, name: this.props.data.name}))
	}
	
	selectType(type: string) {
		this.update(this.props.data.name, type)
		if (type !== 'other') {
			this.setState(() => ({other: false}))
		} else {
			this.setState(() => ({other: true}))
		}
	}
	
	renderType({item}: { item: any }) {
		let selected = item.type === this.props.data.type || item.type === 'other' && !this.flatTypes.includes(this.props.data.type) && this.props.data.type != ''
		let style = (selected) ? styles.selected : styles.cardTitle;
		return (
			<Card style={styles.card} onPress={() => this.selectType(item.type)}>
				<Card.Title title={item.label} titleStyle={style} style={styles.cardTitle}
				            left={() => PetType.getIcon(item, selected)}/>
			</Card>
		)
	}
	
	inputType(type: string) {
		if (type !== '') {
			this.update(this.props.data.name, type)
		} else {
			this.props.onData({})
		}
	}
	
	inputName(name: string) {
		this.update(name, this.props.data.type)
	}
	
	update(name: string, type: string) {
		this.props.onData({name, type})
	}
	
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView>
					<TextInput autoFocus={true} label={'Name'} value={this.props.data.name} style={styles.input} mode={'outlined'}
					           onChangeText={(text) => this.inputName(text)}/>
				</KeyboardAvoidingView>
				<FlatList data={this.types} numColumns={2} renderItem={this.renderType} keyExtractor={(item) => item.label}/>
				{this.state.other &&
				<KeyboardAvoidingView>
					<TextInput label={'Type'} value={this.props.data.type} style={styles.input} mode={'outlined'}
					           onChangeText={(text) => this.inputType(text)}/>
				</KeyboardAvoidingView>}
			</SafeAreaView>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		marginBottom: 180
	},
	cardCover: {
		width: '100%',
		backgroundColor: 'white'
	},
	cardTitle: {
		margin: -10,
		color: '#aaa'
	},
	card: {
		width: '46%',
		margin: '2%',
	},
	selected: {
		margin: -10,
		color: 'black'
	},
	title: {
		margin: 10,
		fontSize: 20,
		fontWeight: 'bold',
	},
	input: {
		margin: '2%'
	}
});
