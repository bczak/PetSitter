import { Component } from "react";
import { ScrollView, Switch } from "react-native-gesture-handler";
import { ScreenProps } from "../types";
import { StyleSheet, Text, View, Image, Dimensions, Picker } from "react-native";
import * as React from "react";
import { Appbar, Avatar, Divider, Headline, Menu, Title, Button, Caption, IconButton, List, ActivityIndicator, Snackbar, Banner } from "react-native-paper";
import { capitalized, translateIcons } from "../utils";
import * as model from "../model/";
import api from "../api";
import { Loader, MemoizedLoader } from "../components/Loader";
import Carousel, { getInputRangeFromIndexes, Pagination } from "react-native-snap-carousel";
import MapView, { Circle } from "react-native-maps";
import Collapsible from "react-native-collapsible";
import { DateTime } from 'luxon'

import DateTimePicker from "@react-native-community/datetimepicker";
import InputDialog from "../components/Dialog";
import { getStatusBarHeight } from "react-native-status-bar-height";
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
			<MapView style={styles.map} pitchEnabled={false} scrollEnabled={false} showsCompass={true} region={location} zoomEnabled={false} rotateEnabled={false}>
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
		sitterCount: 0,
		owner: null as any,
		likeCount: 0,
		reviewsStat: {} as any,
		requesting: false,
		allDay: false,
		startTime: new Date(),
		startDate: new Date(),
		description: 'Description',
		duration: '1 Hour',
		showDatePicker: false,
		showTimePicker: false,
		showDescriptionDialog: false,
		showDurationDialog: false,
		loading: false,
		visible: false,
		message: ''
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
			sitterCount = 0,
			reviewsStat = {};
		if (pet.owner) {
			owner = await api.getUser(pet.owner);
			petCount = await api.getPetsCount(pet.owner);
		}
		if (pet.id) {
			likeCount = await api.getLikeCount(pet.id);
			sitterCount = await api.getSitterCount(pet.id);
			reviewsStat = await api.getReviewsStat(pet.id);
		}
		this.setState(() => ({ pet, owner, petCount, likeCount, reviewsStat, sitterCount }));
	}

	renderImage(item: any, index: number) {
		return (
			<View style={styles.carouselItem}>
				<Image source={{ uri: item }} style={styles.carouselImage} />
			</View>
		);
	}

	async addImage() { }

	async request() {
		this.setState(() => ({ requesting: true }));
	}

	async finish() {
		this.setState(() => ({ loading: true }))
		let formattedTime = DateTime.fromJSDate(this.state.startDate).toISODate() + 'T' + (this.state.allDay ? '00:00:00.000Z' : DateTime.fromJSDate(this.state.startTime).toISOTime())
		let start = DateTime.fromISO(formattedTime).toJSDate().toISOString()

		let request = {
			start: start,
			duration: this.state.allDay ? 24 : Number(this.state.duration.split(' ')[0]),
			note: this.state.description,
			pet: this.state.pet.id,
			requester: api.user?.uid || '',
			acceptor: this.state.owner?.uid || ''
		} as model.Request

		let data = await api.request(request)
		let message = 'Request has successfully been send. Wait for response!'
		if (!data) {
			message = "There was a problem sending your request. Please try again later!"
		}
		this.setState(() => ({ loading: false, visible: true, message, requesting: false }))
	}

	toggleDay() {
		let duration = '1 Day'
		if (this.state.allDay) {
			duration = '1 Hour'
		}
		this.setState(() => ({ allDay: !this.state.allDay, duration }))
	}

	async edit() {
		console.log("edit");
	}
	changeTime() {
		this.setState(() => ({ showDatePicker: true, showTimePicker: false }))
	}

	onConfirmDate(date: any) {
		if (date.nativeEvent.timestamp) {
			this.setState(() => ({ startDate: new Date(date.nativeEvent.timestamp), showDatePicker: false, showTimePicker: true }));
		}
	}
	onConfirmTime(date: any) {
		if (date.nativeEvent.timestamp) {
			this.setState(() => ({ startTime: new Date(date.nativeEvent.timestamp), showDatePicker: false, showTimePicker: false }));
		}
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
			{ color: "black", icon: "paw", text: this.state.sitterCount, caption: "Sitters" },
		];
		let ownerRating = [
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
				<Snackbar
					onDismiss={() => this.setState(() => ({ visible: false }))}
					visible={this.state.visible}
					duration={3000}
					wrapperStyle={{ position: 'absolute', top: getStatusBarHeight() + 56 }}
					action={{ label: 'OK', onPress: () => this.setState(() => ({ visible: false })) }}>
					{this.state.message}
				</Snackbar>
				{this.state.showDatePicker && <DateTimePicker
					value={this.state.startTime}
					mode={"date"}
					is24Hour={true}
					display="calendar"
					onChange={(date: any) => this.onConfirmDate(date)}
				/>}

				{this.state.showTimePicker && <DateTimePicker
					value={this.state.startTime}
					mode={"time"}
					is24Hour={true}
					onChange={(date: any) => this.onConfirmTime(date)}
				/>}
				{this.state.showDescriptionDialog && <InputDialog
					label="Description"
					type='default'
					input={this.state.description}
					text={(text: string) => this.setState(() => ({ description: text }))}
					hide={() => this.setState(() => ({ showDescriptionDialog: false }))} />}
				{this.state.showDurationDialog && <InputDialog
					label="Duration in Hours"
					type='number-pad'
					input={this.state.duration}
					text={(text: string) => this.setState(() => ({ duration: text.split(' ')[0] + ' Hours' }))}
					hide={() => this.setState(() => ({ showDurationDialog: false }))} />}
				<Description pet={this.state.pet} />
				<Statistics data={data} />
				<Collapsible collapsed={!this.state.requesting}>
					<Divider />
					<View style={styles.collapsed}>
						<List.Section>
							<List.Item title="All-day"
								left={() => <List.Icon icon="calendar-today" />}
								right={() => (<Switch value={this.state.allDay} onValueChange={() => this.toggleDay()} />)}
							/>
							<List.Item
								onPress={() => this.changeTime()}
								title={DateTime.fromJSDate(this.state.startDate).toFormat('DDDD') + ' ' + DateTime.fromJSDate(this.state.startTime).toFormat('T')}
								left={() => <List.Icon icon="clock" />}
							/>
							<List.Item
								titleStyle={{ color: this.state.allDay ? 'gray' : 'black' }}
								title={this.state.duration}
								onPress={() => this.setState(() => ({ showDurationDialog: !this.state.allDay }))}
								left={() => <List.Icon icon="timer-sand" color={this.state.allDay ? 'gray' : 'black'} />} />
							<List.Item
								title={this.state.description}
								onPress={() => this.setState(() => ({ showDescriptionDialog: true }))}
								left={() => <List.Icon icon="note" />} />
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
						<Button mode="contained" style={styles.book} icon='calendar-check' loading={this.state.loading} onPress={() => this.finish()}>
							Request
						</Button>
					</View>
				) : (
					<Button mode="contained" style={styles.book} onPress={() => this.request()}>
						Request a walk
					</Button>
				)}
				{location && location.latitude && location.longitude && <Location location={location} />}
				<Divider />
				<View style={styles.title}>
					<Headline style={styles.headline}>Photos</Headline>
					{meOwner && (
						<Button icon="plus" mode="outlined" style={styles.add} onPress={() => this.addImage()}>
							Add
						</Button>
					)}
				</View>
				{(this.state.pet.otherImages || []).length > 0 && <>

					<Carousel
						layout="tinder"
						containerCustomStyle={styles.carousel}
						sliderWidth={width}
						itemWidth={width}
						data={this.state.pet.otherImages}
						renderItem={(data: { item: any; index: number }) => this.renderImage(data.item, data.index)}
						pagingEnabled
						onSnapToItem={(index) => this.setState({ activeSlide: index })}
					/>
					<Pagination
						dotsLength={this.state.pet.otherImages?.length || 0}
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
				</>}
				{this.state.owner && (<><Divider />
					<Headline style={styles.headline}>Owner</Headline>
					<Owner owner={this.state.owner} />
					<Statistics data={ownerRating} /></>)}
			</ScrollView>
		) : (
			<View style={styles.indicator}>
				<ActivityIndicator size='large' />
			</View>
		);
	}
	onDismissSnackBar(): void {
		throw new Error("Method not implemented.");
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
	indicator: {
		flex: 1,
		paddingTop: Dimensions.get('screen').height / 2 - 50
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
