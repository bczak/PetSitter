import React, {Component} from "react";
import {Card, IconButton} from "react-native-paper";
import {StyleSheet} from "react-native";
import {PetRatingProps} from "../../types";


export default class PetRating extends Component<PetRatingProps, any> {
	render() {
		return (
			<Card.Actions style={[styles.actions, this.props.style]}>
				<IconButton icon={this.props.like ? 'heart' : 'heart-outline'} color={"red"}
				            onPress={() => this.props.setLike(!this.props.like)}/>
				<IconButton icon={'message-outline'} color={"grey"} onPress={() => {
				}}/>
				<IconButton icon={'share-variant'} color={"grey"} onPress={() => {
				}}/>
				<IconButton icon={'star-outline'} style={styles.empty} size={0} color={"gold"} onPress={() => {
				}}/>
				<IconButton icon={'star-outline'} size={28} color={"gold"} onPress={() => {
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
	empty: {
		flexGrow: 10,
	}
});
