import * as React from "react";
import { Component } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

import { Appbar, Card, FAB } from "react-native-paper";
import { ChipModel, ScreenProps } from "../types";
import PetCard from "../components/pet/PetCard";
import { Pet } from "../model";
import firebase from "../api";
import ChipSelection from "../components/home/ChipSelection";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { translateTypes } from "../utils";

const defaultChips = [
	{ id: "all", text: "All", selected: true, icon: "paw" } as ChipModel,
	{ id: "dogs", text: "Dogs", selected: false, icon: "dog" } as ChipModel,
	{ id: "cats", text: "Cats", selected: false, icon: "cat" } as ChipModel,
	{ id: "rodents", text: "Rodents", selected: false, icon: "rodent" } as ChipModel,
	{ id: "birds", text: "Birds", selected: false, icon: "food-drumstick" } as ChipModel,
];

export default class HomeScreen extends Component<ScreenProps, any> {
	readonly state = {
		refresh: false,
		pets: [] as Pet[],
		chips: defaultChips,
		fabVisible: true,
	};

	async componentDidMount() {
		await this.onChange();
	}

	async onChange(): Promise<void> {
		let selected = this.state.chips.filter((i) => i.selected).map((i) => i.icon)[0];
		this.setState(() => ({ refresh: true, fabVisible: false }));
		let pets = await firebase.getPets(translateTypes(selected));
		this.setState({ ...this.state, pets: pets });
		this.setState(() => ({ refresh: false, fabVisible: true }));
	}

	async onRefresh() {
		await this.onChange();
	}

	renderPet(data: { item: Pet }) {
		return <PetCard pet={data.item} />;
	}

	async selectChip(chip: ChipModel) {
		let updatedChip = this.state.chips.map((c: ChipModel) => {
			if (c.id == chip.id && c.selected) return null;
			c.selected = chip.id === c.id;
			return c;
		});
		if (updatedChip.includes(null)) return;
		this.setState(() => ({ chips: updatedChip }));
		await this.onChange();
	}

	onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
		if ((e.nativeEvent?.velocity?.y || 0) >= 0 && e.nativeEvent.contentOffset.y > 0) {
			this.setState(() => ({ fabVisible: false }));
		} else {
			this.setState(() => ({ fabVisible: true }));
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Appbar.Header style={styles.header}>
					<Appbar.Content title="Pet Sitter" />
					<Appbar.Action icon={"filter-variant"} />
				</Appbar.Header>

				<FlatList
					ListHeaderComponent={
						<ChipSelection chips={this.state.chips} selectChip={(chip: ChipModel) => this.selectChip(chip)} />
					}
					ListHeaderComponentStyle={styles.chips}
					onScrollToTop={() => this.setState(() => ({ fabVisible: true }))}
					onScroll={(e) => this.onScroll(e)}
					style={styles.list}
					initialNumToRender={2}
					contentContainerStyle={styles.cards}
					data={this.state.pets}
					refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.onRefresh()} />}
					renderItem={this.renderPet}
					keyExtractor={(item: Pet | null) => item?.id || Date.now().toString()}
				/>
				<FAB
					animated={true}
					style={styles.add}
					icon={"plus"}
					visible={this.state.fabVisible}
					onPress={() => {
						this.props.navigation.push("AddPet");
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cards: {
		paddingBottom: 140,
	},
	header: {
		width: "100%",
	},
	chips: {
		display: "flex",
		flexDirection: "row",
		marginBottom: -8,
	},
	container: {
		position: "relative",
		flex: 1,
		alignItems: "flex-start",
		minHeight: Dimensions.get("screen").height + getStatusBarHeight(),
	},
	list: {
		marginTop: 0,
	},
	add: {
		position: "absolute",
		marginHorizontal: 5,
		right: 0,
		bottom: 140,
	},
	empty: {
		height: 300,
	},
});
