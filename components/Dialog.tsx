import React, { Component, useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export default function InputDialog(props: any) {
	const [value, setValue] = useState(props.input)
	return (
		<View>
			<Portal>
				<Dialog
					visible={true}
					onDismiss={() => props.hide()}>
					<Dialog.Content>
						<TextInput
							value={(props.label.split(' ')[0] === 'Duration') ? value.split(' ')[0] : value}
							mode='outlined'
							label={props.label}
							keyboardType={props.type}
							onChangeText={text => setValue(text)}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => {
							props.text(value);
							props.hide()
						}}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	)

}