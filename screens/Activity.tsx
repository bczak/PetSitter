import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Appbar, Button, Caption, Card, Headline, Paragraph, Subheading, Title } from 'react-native-paper';
import api from '../api';
import { ScreenProps } from '../types';

import { Request } from '../model'


export default function ActivityScreen(props: ScreenProps) {

	const [requests, setRequests] = useState([] as Request[])

	function renderItem({ item }: { item: Request }) {
		return <Card style={styles.card}>
			<Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
				<View>
					<Paragraph>{item.status}</Paragraph>
					<Subheading style={{ color: '#0088cc' }}>{item.petEntity?.name}</Subheading>
					<Caption style={{ maxWidth: Dimensions.get('screen').width - 16 - 32 - 80 }}>Request by {item.requesterEntity?.displayName}</Caption>
				</View>
				<Image source={{ uri: item.petEntity?.image }} style={{ width: 80, height: 80 }} />
			</Card.Content>
			<Card.Actions focusable>
				<Button onPress={() => props.navigation.navigate('Pets')}>more</Button>
			</Card.Actions>
		</Card>;
	}

	const refresh = async() => {
		let res = await api.getRequests()
		setRequests(res)
	}

	React.useEffect(() => {
		refresh()
		return props.navigation.addListener('focus', () => {
			refresh()			
		})
	}, [props.navigation])
	const Requests = () => <FlatList
		ListHeaderComponent={
			<Title>Pending requests</Title>
		}
		ListEmptyComponent={
			<View><Caption>Nothing here yet. Add your pet to start receiving requests.</Caption></View>
		}
		data={requests}
		extraData={requests}
		renderItem={(item) => renderItem(item)}
		keyExtractor={(i) => Math.random().toString(36).substring(7)} />
	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Notifications" />
			</Appbar.Header>
			<ScrollView style={styles.container}>
				<View style={styles.content}>
					<Requests />
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
		paddingHorizontal: 8
	},

	header: {
		width: "100%",
	},
	card: {
		marginBottom: 8,
	}
});
