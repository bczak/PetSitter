import {PetCardProps} from "../../types";
import {Avatar, Card, DefaultTheme, IconButton, Paragraph, Title} from "react-native-paper";
import React, {Component, useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import PetRating from "./PetRating";
import Colors from "../../constants/Colors";

export default class PetCard extends Component<PetCardProps, any> {
	state = {like: false}

	constructor(props: PetCardProps) {
		super(props);
	}

	componentDidMount() {
		this.setState(() => ({like: this.props.pet.liked}))
	}

	render() {
		return (
			<Card style={styles.card} theme={DefaultTheme}>
				<Card.Title title={this.props.pet.name}
				            style={styles.title}
				            leftStyle={styles.titleLeft}
				            subtitle={this.props.pet.location?.town || ''}
				            subtitleStyle={styles.subtitle}
				            left={(props) => <Avatar.Icon style={styles.avatar} {...props} icon={this.props.pet.type}/>}
				            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {
				            }}/>}/>
				<Card.Cover style={styles.cardCover} source={{uri: this.props.pet.image}}/>
				<PetRating style={styles.rating} like={this.state.like}
				           setLike={(like: boolean) => this.setState(() => ({like: like}))}/>
			</Card>
		)
	}
}


const styles = StyleSheet.create({
	space: {
		height: 10
	},
	avatar: {
		backgroundColor: Colors.light.primary
	},
	card: {
		margin: '1%',
	},
	cardCover: {
		height: 300
	},
	rating: {
		width: '100%',
		marginVertical: -10,
	},
	title: {
		marginVertical: -10
	},
	subtitle: {
		marginTop: -5,
		marginBottom: 5
	},
	titleLeft: {
		marginHorizontal: -5,
		marginVertical: -10
	}

});
