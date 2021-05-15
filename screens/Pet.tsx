import { Component } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ScreenProps } from "../types";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import * as React from "react";
import { Appbar, Avatar, Divider, Headline, Menu, Title, Button, Caption, IconButton, List } from "react-native-paper";
import { capitalized, translateIcons } from "../utils";
import * as model from "../model/";
import api from "../api";
import { Loader, MemoizedLoader } from "../components/Loader";
import Carousel, { getInputRangeFromIndexes, Pagination } from "react-native-snap-carousel";
import MapView, { Circle } from "react-native-maps";
import Collapsible from "react-native-collapsible";
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
const Owner = ({ owner }: { owner: model.User }) => {
	return (
		<View style={styles.descriptionOwner}>
			<Avatar.Text style={styles.avatarText} label={(owner.firstname?.charAt(0) || "") + owner.lastname?.charAt(0)} />
			<View style={styles.box}>{owner && <Headline style={styles.name}>{owner.displayName}</Headline>}</View>
		</View>
	);
};
const Description = ({ pet }: { pet: model.Pet }) => {
	return (
		<View style={styles.description}>
			{pet.image && <Image style={styles.avatar} source={{ uri: pet.image }} width={100} height={100} />}
			<View style={styles.box}>
				<Headline style={styles.name}>{pet.name}</Headline>
				<Title style={styles.breed}>
					{capitalized(pet.type)}
					{pet.breed ? " • " + capitalized(pet.breed) : ""}
				</Title>
				{pet.location.town && <Caption style={styles.location}>{pet.location.town}</Caption>}
			</View>
		</View>
	);
};
const Statistics = ({ data }: { data: any }) => {
	return (
		<View style={styles.statistics}>
			{data.map((item: any) => (
				<View style={styles.item} key={JSON.stringify(item)}>
					<Button labelStyle={styles.itemButton} color={item.color} icon={item.icon}>
						{item.text}
					</Button>
					<Caption style={styles.itemCaption}>{item.caption}</Caption>
				</View>
			))}
		</View>
	);
};

const Location = ({ location }: { location: any }) => {
	return (
		<View>
			<MapView style={styles.map} showsCompass={true} region={location} zoomEnabled={false} rotateEnabled={false}>
				<Circle
					center={location}
					radius={2000}
					strokeColor={"rgba(0,136, 204,0.5)"}
					fillColor={"rgba(0,136, 204,0.2)"}
				/>
			</MapView>
		</View>
	);
};

export default class Pet extends Component<ScreenProps, any> {
	state = {
		pet: null as any,
		activeSlide: 0,
		petCount: 0,
		owner: null as any,
		likeCount: 0,
		reviewsStat: {} as any,
		requesting: true,
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
		let owner: any = null,
			petCount = 0,
			likeCount = 0,
			reviewsStat = {};
		if (pet.owner) {
			owner = await api.getUser(pet.owner);
			petCount = await api.getPetsCount(pet.owner);
		}
		if (pet.id) {
			likeCount = await api.getLikeCount(pet.id);
			reviewsStat = await api.getReviewsStat(pet.id);
		}
		this.setState(() => ({ pet, owner, petCount, likeCount, reviewsStat }));
	}

	renderImage(item: any, index: number) {
		return (
			<View style={styles.carouselItem}>
				<Image source={{ uri: item }} style={styles.carouselImage} />
			</View>
		);
	}

	async addImage() {}

	async request() {
		this.setState(() => ({ requesting: true }));
		console.log("request");
	}

	async edit() {
		console.log("edit");
	}
	render() {
		const data = [
			{
				color: "#d4af37",
				icon: "star",
				text: this.state.reviewsStat.avg,
				caption: `${this.state.reviewsStat.count} reviews`,
			},
			{ color: "#ed4337", icon: "heart", text: this.state.likeCount, caption: "Favorites" },
			{ color: "black", icon: "paw", text: "17", caption: "Sitters" },
		];
		let ownerRating = [
			{ color: "#d4af37", icon: "star", text: "4.7", caption: "4 reviews" },
			{ color: "black", icon: "paw", text: this.state.petCount, caption: "Pets" },
		];
		const meOwner = api.user?.uid === this.state.owner?.uid;
		let location = {
			latitude: this.state.pet?.location?.lt,
			longitude: this.state.pet?.location?.lg,
			latitudeDelta: 0.03,
			longitudeDelta: 0.03,
		};
		return this.state.pet !== null ? (
			<ScrollView style={styles.container}>
				<AppBar back={() => this.props.navigation.goBack()} />
				<Description pet={this.state.pet} />
				<Statistics data={data} />
				<Collapsible collapsed={!this.state.requesting}>
					<Divider />
					<View style={styles.collapsed}>
						<List.Section>
							<List.Item title="All-day" left={() => <List.Icon icon="clock" />} />
							<List.Item title="First Item" left={() => <List.Icon icon="clock" />} />
							<List.Item title="First Item" left={() => <List.Icon icon="clock" />} />
							<List.Item title="First Item" left={() => <List.Icon icon="clock" />} />
						</List.Section>
					</View>
				</Collapsible>
				{meOwner ? (
					<Button mode="outlined" style={styles.book} onPress={() => this.edit()}>
						Edit
					</Button>
				) : this.state.requesting ? (
					<View style={styles.group}>
						<Button mode="outlined" style={styles.book} onPress={() => this.setState(() => ({ requesting: false }))}>
							Cancel
						</Button>
						<Button mode="contained" style={styles.book} onPress={() => this.request()}>
							Request
						</Button>
					</View>
				) : (
					<Button mode="contained" style={styles.book} onPress={() => this.request()}>
						Request a walk
					</Button>
				)}
				<Location location={location} />
				<Divider />
				<View style={styles.title}>
					<Headline style={styles.headline}>Photos</Headline>
					{meOwner && (
						<Button icon="plus" mode="outlined" style={styles.add} onPress={() => this.addImage()}>
							Add
						</Button>
					)}
				</View>
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
					containerStyle={{ top: -20 }}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
				<Divider />
				<Headline style={styles.headline}>Owner</Headline>
				<Owner owner={this.state.owner} />
				<Statistics data={ownerRating} />
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
		marginBottom: 0,
		padding: 10,
	},
	descriptionOwner: {
		flex: 1,
		flexDirection: "row",
		margin: 20,
		marginBottom: -20,
		padding: 10,
	},
	box: {
		flex: 1,
		marginLeft: 30,
		flexDirection: "column",
		height: 100,
	},
	map: {
		width: "100%",
		height: 200,
	},
	name: {
		fontSize: 26,
		fontWeight: "600",
	},
	breed: {
		fontSize: 14,
		color: "#0088cc",
		top: -10,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 12,
	},
	avatarText: {
		width: 75,
		height: 75,
		borderRadius: 12,
	},
	group: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		flex: 1,
		width: Dimensions.get("screen").width - 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
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
	add: {
		top: -5,
	},
	headline: {
		padding: 20,
		paddingBottom: 0,
	},
	collapsed: {
	},
});
