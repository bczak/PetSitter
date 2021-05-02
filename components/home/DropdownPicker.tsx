import React, {Component, createRef, RefObject} from "react";
import {Picker, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DropdownPickerProps} from "../../types";


export default class DropdownPicker extends Component<DropdownPickerProps, any> {
	ref: RefObject<any> = createRef();
	
	constructor(props: DropdownPickerProps) {
		super(props);
		this.focus = this.focus.bind(this)
	}
	
	focus() {
		this.ref.current.focus()
	}
	
	render() {
		let children = this.props.items.map(i => <Picker.Item label={i.label} value={i.value} key={i.value}/>)
		return (
			<View>
				<Text style={styles.label}>{this.props.label}</Text>
				<View style={styles.picker}>
				<Picker
					ref={this.ref}
					selectedValue={this.props.selected}
					onValueChange={(value) => this.props.select(value)}
					mode="dialog" children={children} onTouchStart={this.focus} />
			</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	picker: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: 4,
		borderColor: 'gray',
		paddingVertical: 3,
		paddingHorizontal: 6,
	},
	label: {
		marginTop: 10,
		fontSize: 16,
		marginLeft: 2
	},
});

