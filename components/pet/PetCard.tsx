import { PetCardProps } from "../../types";
import { Avatar, Card, DefaultTheme, IconButton, Paragraph, Title } from "react-native-paper";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PetRating from "./PetRating";
import firebase from "../../api";
import { translateIcons } from "../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class PetCard extends Component<PetCardProps, any> {
	state = { like: false };

	constructor(props: PetCardProps) {
		super(props);
	}

	componentDidMount() {
		this.setState(() => ({ like: this.props.pet.liked }));
	}

	async like(like: boolean) {
		if (this.props.pet.id == null) return;
		let liked: boolean;
		if (like) {
			this.setState(() => ({ like: true }));
			liked = await firebase.like(this.props.pet.id);
		} else {
			this.setState(() => ({ like: false }));
			liked = await firebase.dislike(this.props.pet.id);
		}
		this.setState(() => ({ like: liked }));
	}

	render() {
		return (
			<Card style={styles.card} theme={DefaultTheme}>
				<TouchableOpacity activeOpacity={0.95} onPress={() => this.props.open()}>
					<Card.Title
						title={this.props.pet.name}
						style={styles.title}
						leftStyle={styles.titleLeft}
						subtitle={this.props.pet.location?.town || ""}
						subtitleStyle={styles.subtitle}
						left={(props) => (
							<Avatar.Icon style={styles.avatar} {...props} icon={translateIcons(this.props.pet.type)} />
						)}
					/>
					<Card.Cover style={styles.cardCover} source={{ uri: this.props.pet.image }} />
				</TouchableOpacity>
				<PetRating style={styles.rating} like={this.state.like} setLike={(like: boolean) => this.like(like)} />
			</Card>
		);
	}
}

const styles = StyleSheet.create({
	space: {
		height: 10,
	},
	avatar: {},
	card: {
		marginVertical: 4,
		borderRadius: 0,
	},
	cardCover: {
		height: 300,
	},
	rating: {
		width: "100%",
		marginVertical: -10,
	},
	title: {
		marginVertical: -10,
	},
	subtitle: {
		marginTop: -5,
		marginBottom: 5,
	},
	titleLeft: {
		marginHorizontal: -5,
		marginVertical: -10,
	},
});
