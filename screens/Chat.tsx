import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Appbar, Button, Caption, Card, Headline, Paragraph, Subheading, Title } from 'react-native-paper';
import { ScreenProps } from '../types';
import api from '../api';
import { Pet, Request } from '../model'
import { DateTime } from 'luxon'
import { Link } from '@react-navigation/native';
export default function ChatScreen(props: ScreenProps) {


	const [requests, setRequests] = useState([] as Request[])
	const [myRequests, setMyRequests] = useState([] as Request[])
	const [pets, setPets] = useState([] as Pet[])

	const accept = async (request: Request) => {
		let message = await api.accept(request)
		if (message !== null) {
			console.error(message)
		} else {
			refresh()
		}
	}
	const decline = async (request: Request) => {
		let message = await api.decline(request)
		if (message !== null) {
			console.error(message)
		} else {
			refresh()
		}
	}

	function renderItem({ item, index }: { item: Request, index: number }) {
		return <Card style={styles.card}>
			<Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
				<View>
					<Paragraph style={{ color: '#b00', fontWeight: 'bold' }}>{item.status}</Paragraph>
					<Subheading style={{ color: 'black' }}>{item.petEntity?.name}</Subheading>
					<Text style={{ maxWidth: Dimensions.get('screen').width - 16 - 32 - 80 }}>
						Request by <Text style={{ color: '#0088cc' }}>{item.requesterEntity?.displayName}</Text>
					</Text>
				</View>
				<Image source={{ uri: item.petEntity?.image }} style={{ width: 80, height: 80 }} />
			</Card.Content>
			<Card.Content>
				<Text>Date: <Text style={{ color: 'grey' }}>{DateTime.fromISO(item.start).toFormat('DDDD')}</Text></Text>
				<Text>Time: <Text style={{ color: 'grey' }}>{DateTime.fromISO(item.start).toFormat('T')}</Text></Text>
				<Text>Duration: <Text style={{ color: 'grey' }}>{item.duration === 24 ? 'All Day' : item.duration + ' Hour(s)'}</Text></Text>
				<Text>Note: <Text style={{ color: 'grey' }}>{item.note}</Text></Text>
			</Card.Content>
			<Card.Actions style={{ alignContent: 'flex-end', margin: 8, marginTop: 0 }}>
				<Button style={{ marginRight: 8 }} color='#09af00' onPress={() => accept(item)} mode='contained'>Accept</Button>
				<Button style={{ marginRight: 8 }} color='#b00' onPress={() => decline(item)} mode='contained'>Decline</Button>
			</Card.Actions>
		</Card>;
	}
	function renderMyItem({ item, index }: { item: Request, index: number }) {
		return <Card style={styles.card}>
			<Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
				<View>
					<Paragraph style={{ color: item.status.charAt(0) === 'A' ? '#09af00' : '#b00', fontWeight: 'bold' }}>{item.status}</Paragraph>
					<Subheading style={{ color: '#0088cc' }} onPress={() => props.navigation.navigate('Pet', { pet: item.petEntity })}>{item.petEntity?.name}</Subheading>
					<Text style={{ maxWidth: Dimensions.get('screen').width - 16 - 32 - 80 }}>
						Request for <Text style={{ color: '#0088cc' }} >{item.acceptorEntity?.displayName}</Text>
					</Text>
				</View>
				<Image source={{ uri: item.petEntity?.image }} style={{ width: 80, height: 80 }} />
			</Card.Content>
			<Card.Content style={{ marginBottom: 8 }}>
				<Text>Date: <Text style={{ color: 'grey' }}>{DateTime.fromISO(item.start).toFormat('DDDD')}</Text></Text>
				<Text>Time: <Text style={{ color: 'grey' }}>{DateTime.fromISO(item.start).toFormat('T')}</Text></Text>
				<Text>Duration: <Text style={{ color: 'grey' }}>{item.duration === 24 ? 'All Day' : item.duration + ' Hour(s)'}</Text></Text>
				<Text>Note: <Text style={{ color: 'grey' }}>{item.note}</Text></Text>
				{item.status === 'ACCEPTED' && <Text>Address: <Text style={{ color: 'grey' }}>{item.petEntity?.location.all || 'None'}</Text></Text>}
			</Card.Content>
			{
				item.status === 'ACCEPTED' && (new Date(item.start) < new Date() ?
					(item.acceptor !== api.user?.uid && <Card.Actions style={{ margin: 8, marginTop: 0 }}>
						<Button mode='contained' onPress={() => props.navigation.navigate('Reviews', { id: item.pet })}>Leave a review</Button>
					</Card.Actions>) :
					(<Card.Actions style={{ margin: 8, marginTop: 0 }}>
						<Button>Walk starts {DateTime.fromISO(item.start).toRelative()}</Button>
					</Card.Actions>))
			}
		</Card>;
	}

	const refresh = async () => {
		let res = await api.getRequests()
		let myReqs = await api.getMyRequests()
		let pets = await api.getMyPets()
		setPets(pets)
		setRequests(res)
		setMyRequests(myReqs)
	}

	React.useEffect(() => {
		refresh()
		return props.navigation.addListener('focus', () => refresh())
	}, [props.navigation])

	const renderPet = ({ item, index }: { item: Pet, index: number }) => {
		return <Card style={{ width: 200, margin: 4 }} onPress={() => props.navigation.navigate('Pet', { pet: item })}>
			<Card.Cover source={{ uri: item.image }} />
			<Card.Title title={item.name} />
		</Card>
	}

	const Requests = () => <FlatList
		ListEmptyComponent={
			<View><Caption style={{ paddingHorizontal: 4 }}>Nothing here yet. Enjoy the app</Caption></View>
		}
		ListHeaderComponent={
			<View style={{ marginVertical: 4 }}></View>
		}
		data={requests}
		extraData={requests}
		renderItem={(item) => renderItem(item)}
		keyExtractor={(i) => Math.random().toString(36).substring(7)} />
	const MyRequests = () => <FlatList
		ListEmptyComponent={
			<View><Caption style={{ paddingHorizontal: 4 }}>Nothing here yet. Enjoy the app</Caption></View>
		}
		ListHeaderComponent={
			<View style={{ marginVertical: 4 }}></View>
		}
		data={myRequests}
		extraData={myRequests}
		renderItem={(item) => renderMyItem(item)}
		keyExtractor={(i) => Math.random().toString(36).substring(7)} />
	const Pets = () => <FlatList
		data={pets}
		ListEmptyComponent={
			<View><Caption style={{ padding: 4 }} >Nothing here yet. Enjoy the app</Caption></View>
		}
		extraData={pets}
		horizontal={true}
		renderItem={(item) => renderPet(item)}
		keyExtractor={(i) => Math.random().toString(36).substring(7)}
	/>

	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Pets" />
			</Appbar.Header>
			<ScrollView style={styles.container}>
				<View style={styles.content}>
					<Title style={{ padding: 4 }}>My pets</Title>
					<Pets />
					<Title style={{ padding: 4 }}>Pending requests</Title>
					<Requests />
					<Title style={{ padding: 4 }}>My requests</Title>
					<MyRequests />

				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 4
	},

	header: {
		width: "100%",
	},
	card: {
		marginBottom: 8,
		marginHorizontal: 4
	}
});
