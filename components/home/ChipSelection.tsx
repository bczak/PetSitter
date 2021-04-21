import {ChipModel, ChipSelectionProps} from "../../types";
import {Chip} from "react-native-paper";
import React, {Component} from "react";
import {ScrollView, StyleSheet, View} from "react-native";


export default class ChipSelection extends Component<ChipSelectionProps, any> {

	renderChip(chip: any) {
		return (
			<Chip style={styles.chip}
			      icon={chip.icon}
			      key={chip.id}
			      selected={chip.selected}
			      onPress={() => this.props.selectChip(chip)}>{chip.text}</Chip>
		)
	}

	render() {
		return (
			<ScrollView showsHorizontalScrollIndicator={false}
			            horizontal={true}
			            style={this.props.style}>
				{this.props.chips.map((chip) => this.renderChip(chip))}{<Chip style={styles.empty}> </Chip>}
			</ScrollView>
		)
	}
}


const styles = StyleSheet.create({
	chip: {
		marginVertical: 5,
		marginHorizontal: 2,
		height: 32,
		marginBottom: 10
	},
	empty: {
		height: 0,
		width: 10,
	}
})
