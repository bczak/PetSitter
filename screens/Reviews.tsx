import * as React from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Appbar, Avatar, Button, Card, Dialog, FAB, Paragraph, Portal, Text, TextInput } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import api from '../api'
import ChipSelection from '../components/home/ChipSelection'
import { Pet, Review } from '../model'
import { ChipModel, ScreenProps, } from '../types'
import { Rating } from 'react-native-ratings';



const ReviewDialog = (props: any) => {

	const hideDialog = () => props.hide(false);
	const [text, setText] = React.useState('')
	const [rating, setRating] = React.useState(5)
	return (
		<Portal>
			<Dialog visible={props.visible} onDismiss={hideDialog}>
				<Dialog.Title>Write a review</Dialog.Title>
				<Dialog.Content>
					<Rating
						imageSize={(Dimensions.get('window').width - 120) / 5}
						ratingCount={5}
						startingValue={rating}
						onFinishRating={(r: number) => setRating(r)}
						style={{ paddingVertical: 10 }}
					/>
					<TextInput multiline label='Review' value={text} mode='outlined' onChangeText={(t) => setText(t)} />
				</Dialog.Content>
				<Dialog.Actions>
					<Button style={{ margin: 16, marginTop: -8 }} mode='contained' onPress={async () => {
						await api.addReview(text, rating, props.pet)
						props.done()
						props.hide()
					}}>   POST   </Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};


export default function Reviews(props: ScreenProps) {

	const [chip, setChip] = React.useState([
		{ id: 'all', icon: 'star', selected: true, text: 'All' } as ChipModel,
		{ id: '5', icon: 'star', selected: false, text: '5' } as ChipModel,
		{ id: '4', icon: 'star', selected: false, text: '4' } as ChipModel,
		{ id: '3', icon: 'star', selected: false, text: '3' } as ChipModel,
		{ id: '2', icon: 'star', selected: false, text: '2' } as ChipModel,
		{ id: '1', icon: 'star', selected: false, text: '1' } as ChipModel,
	])
	const [pet, setPet] = React.useState({} as Pet)
	const [reviews, setReviews] = React.useState([] as Review[])
	const [allReviews, setAllReviews] = React.useState([] as Review[])
	React.useEffect(() => {
		(async () => {
			const id = props.route.params?.id || null
			if (id === null) return props.navigation.navigate('Home')
			setPet(await api.getPet(id) || {} as Pet)
			let all = await api.getReviews(id)
			setAllReviews(all)
			setReviews(all)
			console.log('updated');
			console.log(all.map(i => i.created));
		})()
	}, [props.navigation])

	const [dialog, setDialog] = React.useState(false);

	const renderReview = ({ item, index }: { item: Review, index: number }) => {
		return <Card elevation={0} style={{ width: Dimensions.get('screen').width, marginVertical: 8 }}>
			<Card.Title title={item.authorEntity.displayName} left={() => <Avatar.Icon icon={`numeric-${item.rating}-box`} size={30} />} />
			<Card.Content>
				<Text>{item.text}</Text>
			</Card.Content>
		</Card>
	}

	const chips = <ChipSelection chips={chip} selectChip={async (c: ChipModel) => setChip(await Promise.all(chip.map(async (i) => {
		if (i.id === c.id) {
			i.selected = true;
			setReviews(allReviews.filter(r => r.rating.toString() === i.id || i.id === 'all'))
		} else {
			i.selected = false
		}
		return i
	})))} />
	return (<View style={styles.container}>
		<Appbar.Header style={styles.header}>
			<Appbar.BackAction onPress={() => props.navigation.goBack()} />
			<Appbar.Content title={pet.name} />
		</Appbar.Header>
		<ReviewDialog hide={() => setDialog(false)} visible={dialog} pet={props.route.params?.id} done={() => {
			console.log('reload');

			props.navigation.navigate("Reviews", { pet: props.route.params?.id }, null, Date.now())
		}} />
		<Portal>
			<FAB
				animated={true}
				style={styles.add}
				icon={"plus"}
				onPress={() => {
					setDialog(true)
				}}
			/>
		</Portal>
		<ScrollView>
			<FlatList
				data={reviews}
				style={styles.list}
				renderItem={renderReview}
				ListHeaderComponent={chips}
				ListEmptyComponent={<Text style={{ margin: 16 }}>No reviews yet. Be the first</Text>}
				ListHeaderComponentStyle={styles.chips}
				ListFooterComponent={<View style={{ height: 100 }}></View>}
				keyExtractor={(i) => i.created.toISOString()}
			/>
		</ScrollView>
	</View>)
}


const styles = StyleSheet.create({
	container: {
		position: "relative",
		flex: 1,
		alignItems: "flex-start",
		minHeight: Dimensions.get("window").height + getStatusBarHeight(),
	},
	header: {
		width: "100%",
	},
	chips: {
		display: "flex",
		flexDirection: "row",
		marginBottom: -8,
	},
	list: {
		marginTop: 0,
	},
	add: {
		position: "absolute",
		marginHorizontal: 16,
		right: 0,
		bottom: 16,
	}
});
