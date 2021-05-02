import * as React from 'react';
import {Component} from 'react';
import {FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet} from 'react-native';

import {View} from '../components/Themed';
import {Appbar, FAB} from "react-native-paper";
import {ChipModel, ScreenProps} from "../types";
import PetCard from "../components/pet/PetCard";
import {Pet} from "../model";
import firebase from "../api";
import ChipSelection from "../components/home/ChipSelection";
import Colors from "../constants/Colors";

const defaultChips = [
	{id: 'all', text: 'All', selected: true, icon: 'paw'} as ChipModel,
	{id: 'dogs', text: 'Dogs', selected: false, icon: 'dog'} as ChipModel,
	{id: 'cats', text: 'Cats', selected: false, icon: 'cat'} as ChipModel,
	{id: 'rodents', text: 'Rodents', selected: false, icon: 'rodent'} as ChipModel,
	{id: 'birds', text: 'Birds', selected: false, icon: 'food-drumstick'} as ChipModel,
]

export default class HomeScreen extends Component<ScreenProps, any> {
	readonly state = {
		refresh: false,
		pets: [] as Pet[],
		chips: defaultChips,
		fabVisible: false
	}
	
	async componentDidMount() {
		await this.onChange()
	}
	
	async onChange(): Promise<void> {
		this.setState(() => ({refresh: true, fabVisible: false}))
		this.setState({...this.state, pets: await firebase.getPets()});
		this.setState(() => ({refresh: false, fabVisible: true}))
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
	
	onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
		if ((e.nativeEvent?.velocity?.y || 0) >= 0 && e.nativeEvent.contentOffset.y > 0) {
			this.setState(() => ({fabVisible: false}))
		} else {
			this.setState(() => ({fabVisible: true}))
		}
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Appbar.Header style={styles.header}>
					<Appbar.Content title="Pet Sitter"/>
					<Appbar.Action icon={'filter-variant'}/>
				</Appbar.Header>
				<ChipSelection chips={this.state.chips}
				               selectChip={(chip: ChipModel) => this.selectChip(chip)}
				               style={styles.chips}/>
				
				<FlatList onScrollToTop={() => this.setState(() => ({fabVisible: true}))}
				          onScroll={(e) => this.onScroll(e)}
				          contentContainerStyle={styles.cards} data={this.state.pets}
				          refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.onRefresh()}/>}
				          renderItem={this.renderPet} keyExtractor={(item: Pet) => item.id}/>
				<FAB animated={true} style={styles.add} icon={"plus"} visible={this.state.fabVisible}
				     onPress={() => {this.props.navigation.navigate('AddPet')}}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f2f2f2',
	},
	cards: {
		paddingBottom: 140,
		backgroundColor: '#f2f2f2',
	},
	header: {
		backgroundColor: Colors.light.primary
	},
	chips: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#f2f2f2',
		paddingRight: 5,
		paddingLeft: 5,
		paddingBottom: 2,
	},
	add: {
		position: 'absolute',
		marginHorizontal: 5,
		right: 0,
		bottom: 54 + 90,
		backgroundColor: "#0088cc"
	}
});
