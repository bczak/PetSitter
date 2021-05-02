import React, {Component} from "react";
import {Card, IconButton} from "react-native-paper";
import {StyleSheet} from "react-native";
import {PetRatingProps} from "../../types";


export default class PetRating extends Component<PetRatingProps, any> {
	async likePet() {
		await this.props.setLike(!this.props.like)
	}
	render() {
		return (
			<Card.Actions style={[styles.actions, this.props.style]}>
				<IconButton animated={true} icon={this.props.like ? 'heart' : 'heart-outline'}
				            color={this.props.like ? styles.like.color : 'grey'}
				            onPress={() => this.likePet()}/>
				<IconButton icon={'message-outline'}
				            color={"grey"}
				            onPress={() => console.log('reviews')}/>
				<IconButton style={styles.empty} size={0} icon={'star'}/>
				<IconButton icon={'share-variant'} color={"grey"} onPress={() => {
				}}/>
			</Card.Actions>
		)
	}
}


const styles = StyleSheet.create({
	actions: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	like: {
		color: "#d50000"
	},
	empty: {
		flexGrow: 10,
	}
});
