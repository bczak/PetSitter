import * as React from 'react';
import {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';

import {View} from '../components/Themed';
import {Appbar} from "react-native-paper";
import {ChipModel} from "../types";
import PetCard from "../components/pet/PetCard";
import {Pet} from "../model";
import firebase from "../api";
import ChipSelection from "../components/home/ChipSelection";
import Colors from "../constants/Colors";
import App from "../App";

const defaultChips = [
	{id: 'all', text: 'All', selected: true, icon: 'paw'} as ChipModel,
	{id: 'dogs', text: 'Dogs', selected: false, icon: 'dog'} as ChipModel,
	{id: 'cats', text: 'Cats', selected: false, icon: 'cat'} as ChipModel,
	{id: 'rodents', text: 'Rodents', selected: false, icon: 'rodent'} as ChipModel,
]

export default class HomeScreen extends Component {
	readonly state = {
		refresh: false,
		pets: [] as Pet[],
		chips: defaultChips
	}

	constructor(props: any) {
		super(props)
	}

	async componentDidMount() {
		await this.onChange()
		console.log('mounted')
	}

	async onChange(): Promise<void> {
		this.setState(() => ({refresh: true}))
		this.setState({...this.state, pets: await firebase.getPets()});
		this.setState(() => ({refresh: false}))
	}

	async onRefresh() {
		await this.onChange()
	}

	renderPet(data: { item: Pet }) {
		return <PetCard pet={data.item}/>
	}

	selectChip(chip: ChipModel) {
		let updatedChip = this.state.chips.map((c: ChipModel) => {
			if (c.id == chip.id && c.selected) return null
			c.selected = chip.id === c.id;
			return c;
		})
		if (updatedChip.includes(null)) return;
		this.setState(() => ({chips: updatedChip}))
	}

	render() {
		return (
			<View style={styles.container}>
				<Appbar.Header style={styles.header}>
					<Appbar.Content title="Pet Sitter"/>
					<Appbar.Action icon={'login-variant'}/>
				</Appbar.Header>
				<ChipSelection chips={this.state.chips} selectChip={(chip: ChipModel) => this.selectChip(chip)}
				               style={styles.chips}/>
				<FlatList contentContainerStyle={styles.cards} data={this.state.pets}
				          refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.onRefresh()}/>}
				          renderItem={this.renderPet} keyExtractor={(item: Pet) => item.id}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {},
	cards: {
		paddingBottom: 150,
		paddingHorizontal: 4,
		backgroundColor: '#f2f2f2',
	},
	header: {
		backgroundColor: Colors.light.primary
	},
	chips: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#f2f2f2',
		paddingHorizontal: 10,
		paddingBottom: 1
	}
});