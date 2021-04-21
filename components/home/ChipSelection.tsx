import {ChipModel, ChipSelectionProps} from "../../types";
import {Chip} from "react-native-paper";
import React, {Component} from "react";
import {StyleSheet, View} from "react-native";


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
			<View style={this.props.style}>{this.props.chips.map((chip) => this.renderChip(chip))}</View>
		)
	}
}


const styles = StyleSheet.create({
	chip: {
		marginVertical: 5,
		marginHorizontal: 2
	}
})
