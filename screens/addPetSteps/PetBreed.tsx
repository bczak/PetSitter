import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Dimensions,
} from "react-native";
import { StepProps } from "../../types";
import { Avatar, Button, Card, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
class PetBreed extends Component<StepProps, any> {
	state = {
		dateModal: false,
	};

	componentDidMount() {
		this.update();
	}

	update(
		breed: string | undefined = undefined,
		birthday: Date | undefined = undefined,
		weight: string | undefined = undefined
	) {
		this.props.onData({
			weight: weight === undefined ? this.props.data.weight : weight,
			birthday: birthday === undefined ? this.props.data.birthday : birthday,
			breed: breed === undefined ? this.props.data.breed : breed,
		});
	}

	async typeBreed(text: string) {
		this.update(text);
	}

	onDismiss() {
		this.setState(() => ({ dateModal: false }));
	}

	componentDidUpdate(prevProps: Readonly<StepProps>, prevState: Readonly<any>, snapshot?: any) {

		if (this.state.dateModal) {
			this.setState(() => ({ dateModal: false }));
		}
	}

	onConfirm(date: any) {
		if (date.nativeEvent.timestamp) {
			this.update(undefined, new Date(date.nativeEvent.timestamp));
		}
	}

	select(size: string) {
		if (!isNaN(Number(size)) || size.length == 0) {
			this.update(undefined, undefined, size);
		}
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="height">
				<Text style={styles.title}>Breed</Text>
				<TextInput
					label={"Breed"}
					style={styles.search}
					value={this.props.data.breed}
					mode={"outlined"}
					onChangeText={(text) => this.typeBreed(text)}
				/>

				<Text style={styles.title}>Weight</Text>
				<TextInput
					label={"Weight"}
					style={styles.search}
					value={this.props.data.weight}
					keyboardType="number-pad"
					mode={"outlined"}
					right={<TextInput.Affix text="KG" />}
					onChangeText={(text) => this.select(text)}
				/>
				<Text style={styles.title}>Date of Birth</Text>

				<View style={styles.birthday}>
					<Text style={styles.date}>{new Date(this.props.data.birthday).toLocaleDateString()}</Text>
					<Button mode={"contained"} onPress={() => this.setState(() => ({ dateModal: true }))}>
						Select date
					</Button>
				</View>
				<View style={styles.empty}></View>
				{this.state.dateModal && (
					<DateTimePicker
						value={this.props.data.birthday}
						mode={"date"}
						is24Hour={true}
						display="calendar"
						onChange={(date: any) => this.onConfirm(date)}
					/>
				)}
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		height: Dimensions.get("window").height,
	},
	birthday: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 5,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
		paddingHorizontal: 5,
		marginTop: 10,
	},
	date: {
		fontSize: 30,
	},
	search: {
		margin: 2,
		marginBottom: 12,
	},
	scroll: {
		paddingBottom: 20,
	},
	list: {},
	card: {
		margin: 2,
	},
	empty: {
		height: 50,
	},
	selectedSize: {
		marginRight: 15,
	},
});

export default React.memo(PetBreed);
