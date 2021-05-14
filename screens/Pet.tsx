import { Component } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ScreenProps } from "../types";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import * as React from "react";
import { Appbar, Avatar, Divider, Headline, Menu, Title, Button, Caption, IconButton } from "react-native-paper";
import { capitalized, translateIcons } from "../utils";
import * as model from "../model/";
import api from "../api";
import { Loader, MemoizedLoader } from "../components/Loader";
import Carousel, { getInputRangeFromIndexes, Pagination } from "react-native-snap-carousel";

const width = Dimensions.get("screen").width;
const AppBar = ({ back }: { back: Function }) => {
	const [visible, setVisible] = React.useState(false);
	const closeMenu = () => setVisible(false);
	const openMenu = () => setVisible(true);
	const share = () => {
		closeMenu();
	};
	const report = () => {
		closeMenu();
	};
	return (
		<Appbar.Header style={styles.header}>
			<Appbar.BackAction onPress={() => back()} />
			<Appbar.Content title="Pet" />
			<Menu
				visible={visible}
				onDismiss={closeMenu}
				anchor={<Appbar.Action color={"white"} icon="dots-vertical" onPress={openMenu} />}
			>
				<Menu.Item onPress={() => share()} title="Share" />
				<Menu.Item onPress={() => report()} title="Report" />
			</Menu>
		</Appbar.Header>
	);
};

const Description = ({ pet }: { pet: model.Pet }) => {
	return (
		<View style={styles.description}>
			<Image style={styles.avatar} source={{ uri: pet.image }} width={70} height={70} />
			<View style={styles.box}>
				<Headline style={styles.name}>{pet.name}</Headline>
				<Title style={styles.breed}>
					{capitalized(pet.type)}
					{pet.breed ? " • " + capitalized(pet.breed) : ""}{" "}
				</Title>
				<Caption style={styles.location}>{pet.location.town}</Caption>
			</View>
		</View>
	);
};
const Statistics = ({ pet }: { pet: model.Pet }) => {
	return (
		<View style={styles.statistics}>
			<View style={styles.item}>
				<Button labelStyle={styles.itemButton} color="#d4af37" icon="star">
					4.3
				</Button>
				<Caption style={styles.itemCaption}>10K reviews</Caption>
			</View>
			<View style={styles.item}>
				<Button labelStyle={styles.itemButton} color="#b00" icon="heart">
					1003
				</Button>
				<Caption style={styles.itemCaption}>Favorites</Caption>
			</View>
			<View style={styles.item}>
				<Button labelStyle={styles.itemButton} icon="paw">
					30
				</Button>
				<Caption style={styles.itemCaption}>Sitters</Caption>
			</View>
		</View>
	);
};

export default class Pet extends Component<ScreenProps, any> {
	state = {
		pet: null as any,
		activeSlide: 0,
	};
	async componentDidMount() {
		let id = this.props.route?.params?.pet.id || null;
		if (id === null) {
			return this.props.navigation.navigate("Home");
		}
		let pet = await api.getPet(id);
		if (pet === null) {
			return this.props.navigation.navigate("Home");
		}
		this.setState(() => ({ pet }));
	}

	renderImage(item: any, index: number) {
		console.log(index);

		return (
			<View style={styles.carouselItem}>
				<Image source={{ uri: item }} style={styles.carouselImage} />
			</View>
		);
	}

	render() {
		return this.state.pet !== null ? (
			<ScrollView style={styles.container}>
				<AppBar back={() => this.props.navigation.goBack()} />
				<Description pet={this.state.pet} />
				<Statistics pet={this.state.pet} />
				<Button mode="contained" style={styles.book}>
					Request a walk
				</Button>
				<Divider />
				<Headline style={styles.headline}>Photos</Headline>
				<Carousel
					layout="stack"
					containerCustomStyle={styles.carousel}
					sliderWidth={width}
					itemWidth={width}
					data={this.state.pet.otherImages}
					renderItem={(data: { item: any; index: number }) => this.renderImage(data.item, data.index)}
					pagingEnabled
					onSnapToItem={(index) => this.setState({ activeSlide: index })}
				/>
				<Pagination
					dotsLength={this.state.pet.otherImages.length}
					activeDotIndex={this.state.activeSlide}
					dotStyle={{
						width: 10,
						height: 10,
						borderRadius: 5,
						marginHorizontal: 8,
						backgroundColor: "rgba(0,0,0,0.5)",
					}}
					containerStyle={{top: -20}}
					inactiveDotStyle={
						{
							// Define styles for inactive dots here
						}
					}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
			</ScrollView>
		) : (
			<MemoizedLoader />
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		width: "100%",
	},
	description: {
		flex: 1,
		flexDirection: "row",
		margin: 20,
		padding: 10,
	},
	box: {
		flex: 1,
		marginLeft: 30,
		flexDirection: "column",
		height: 90,
	},
	name: {
		fontSize: 32,
		fontWeight: "600",
	},
	breed: {
		fontSize: 14,
		color: "#0088cc",
		top: -10,
	},
	avatar: {
		width: 85,
		height: 85,
		borderRadius: 12,
	},
	statistics: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		marginBottom: 20,
	},
	item: {},
	location: {
		top: -20,
	},
	itemButton: {
		textAlign: "center",
		fontSize: 22,
	},
	itemCaption: {
		textAlign: "center",
	},
	book: {
		margin: 20,
	},
	carousel: {
		margin: 20,
	},
	carouselImage: {
		height: width - 40,
		width: width - 40,
		borderRadius: 10,
	},
	carouselItem: {},
	headline: {
		padding: 20,
		paddingBottom: 0
	}
});
