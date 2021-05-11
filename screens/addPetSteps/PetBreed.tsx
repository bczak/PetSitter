import React, {Component} from "react";
import {View, Text, ScrollView, FlatList, StyleSheet, Dimensions, KeyboardAvoidingView} from "react-native";
import {StepProps} from "../../types";
import {Avatar, Button, Card, TextInput} from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

class PetBreed extends Component<StepProps, any> {
	private sizes = [
		'0 - 1 KG',
		'1 - 5 KG',
		'5 - 10 KG',
		'10 - 20 KG',
		'20 - 50 KG',
		'50 - 100 KG',
	]
	state = {
		dateModal: false,
	}
	
	
	componentDidMount() {
		this.update()
	}
	
	update(breed: string | undefined = undefined, birthday: Date | undefined = undefined, size: string | undefined = undefined) {
		this.props.onData({
			size: size || this.props.data.size,
			birthday: birthday || this.props.data.birthday,
			breed: breed || this.props.data.breed
		})
	}
	
	async typeBreed(text: string) {
		this.update(text);
	}
	
	onDismiss() {
		this.setState(() => ({dateModal: false}))
	}
	
	componentDidUpdate(prevProps: Readonly<StepProps>, prevState: Readonly<any>, snapshot?: any) {
		if (this.state.dateModal) {
			this.setState(() => ({dateModal: false}))
		}
	}
	
	onConfirm(date: any) {
		if (date.nativeEvent.timestamp) {
			this.update();
		}
		
	}
	
	select(size: string) {
		this.update(undefined, undefined, size)
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Breed</Text>
				<TextInput label={'Breed'} autoFocus={true} style={styles.search} value={this.props.data.breed}
				           mode={'outlined'}
				           onChangeText={(text) => this.typeBreed(text)}/>
				<Text style={styles.title}>Date of Birth</Text>
				<View style={styles.birthday}>
					<Text style={styles.date}>{new Date(this.props.data.birthday).toLocaleDateString()}</Text>
					<Button mode={"contained"} onPress={() => this.setState(() => ({dateModal: true}))}>Select date</Button>
				</View>
				{this.state.dateModal && <DateTimePicker
					value={this.props.data.birthday}
					mode={'date'}
					is24Hour={true}
					display="calendar"
					onChange={(date: any) => this.onConfirm(date)}
				/>}
				<Text style={styles.title}>Size</Text>
				<FlatList data={this.sizes} keyExtractor={(item) => item} renderItem={({item}) =>
					<Card style={styles.card} key={item} onPress={() => this.select(item)}>
						<Card.Title title={item} rightStyle={styles.selectedSize}
						            right={this.props.data.size === item ? () =>
							            <Avatar.Icon size={35} icon={'check'}/> : () => null}/>
					</Card>}/>
			</View>
		)
	}
	
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		height: Dimensions.get('screen').height - 130,
	},
	birthday: {
		flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
		paddingHorizontal: 5
	},
	date: {
		fontSize: 30,
	},
	search: {
		margin: 2,
		marginBottom: 12
	},
	scroll: {
		paddingBottom: 20
	},
	card: {
		margin: 2
	},
	selectedSize: {
		marginRight: 15
	}
});


export default React.memo(PetBreed)
