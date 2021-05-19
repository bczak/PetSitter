import * as React from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import { Appbar, Avatar, Headline, Searchbar } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ChipSelection from '../components/home/ChipSelection';
import PetCard from '../components/pet/PetCard';
import { Pet } from '../model';
import { ChipModel, defaultChips, ScreenProps } from '../types';
import firebase from "../api";
import { translateTypes } from '../utils';
const EmptyCard = () => (
	<View style={styles.emptyCard}>
		<Avatar.Icon icon="paw" size={100} />
		<Headline>Nothing here yet</Headline>
	</View>
);
export default class SearchScreen extends React.Component<ScreenProps, any> {
	readonly state = {
		refresh: false,
		pets: [] as Pet[],
		chips: defaultChips,
		search: ''
	};

	async onChange(): Promise<void> {
		let selected = this.state.chips.filter((i) => i.selected).map((i) => i.icon)[0];
		this.setState(() => ({ refresh: true }));
		let pets = await firebase.searchPets(translateTypes(selected), this.state.search);
		this.setState({ ...this.state, pets: pets });
		this.setState(() => ({ refresh: false }));
	}

	async onRefresh() {
		await this.onChange();
	}

	async openPet(pet: Pet) {
		this.props.navigation.navigate("Pet", { pet: pet });
	}

	renderPet(data: { item: Pet }) {
		return <PetCard navigation={this.props.navigation} pet={data.item} open={() => this.openPet(data.item)} />;
	}
	async onChangeSearch(text: string) {
		this.setState(() => ({ search: text }))
		this.onChange()
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
	render() {

		return (
			<View style={styles.container}>
				<Appbar.Header style={styles.header}>
					<Searchbar
						placeholder="Search"
						onChangeText={(text) => this.onChangeSearch(text)}
						value={this.state.search}
					/>
					<Appbar.Action icon={"magnify"} />
				</Appbar.Header>

				<FlatList
					ListHeaderComponent={
						<ChipSelection chips={this.state.chips} selectChip={(chip: ChipModel) => this.selectChip(chip)} />
					}
					ListHeaderComponentStyle={styles.chips}
					ListEmptyComponent={<EmptyCard />}
					onScrollToTop={() => this.setState(() => ({ fabVisible: true }))}
					style={styles.list}
					initialNumToRender={2}
					contentContainerStyle={styles.cards}
					data={this.state.pets}
					refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.onRefresh()} />}
					renderItem={(_) => this.renderPet(_)}
					keyExtractor={(item: Pet | null) => item?.id || Date.now().toString()}
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
		minHeight: Dimensions.get("window").height + getStatusBarHeight(),
	},
	list: {
		marginTop: 0,
	},
	add: {
		position: "absolute",
		marginHorizontal: 5,
		right: 0,
		bottom: getStatusBarHeight() + 60,
	},
	empty: {
		height: 300,
	},
	emptyCard: {
		flex: 1,
		justifyContent: "space-evenly",
		width: Dimensions.get("screen").width,
		alignItems: "center",
		flexDirection: "column",
		height: Dimensions.get("screen").height / 3,
	},
});
