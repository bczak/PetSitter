import React, {Component} from 'react';
import {
	ImageBackground,
	StyleSheet,
	KeyboardAvoidingView,
	Dimensions,
} from 'react-native';


const height = Dimensions.get('screen').height

export default class Background extends Component<any, any> {
	render() {
		console.log(height);
		
		return (
			<ImageBackground
				source={require('../../assets/images/background_dot.png')}
				resizeMode="repeat"
				style={styles.background}
			>
				<KeyboardAvoidingView style={styles.container} behavior="padding">
					{this.props.children}
				</KeyboardAvoidingView>
			</ImageBackground>
		)
	}
}


const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: '100%',
		height: height,
		position: 'relative'
	},
	container: {
		padding: 20,
		width: '100%',
		position: 'relative'
	},
});
