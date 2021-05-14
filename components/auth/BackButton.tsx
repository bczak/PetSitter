import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {IconButton} from "react-native-paper";

type Props = {
	goBack: () => void;
};

const BackButton = ({goBack}: Props) => (
	<IconButton style={styles.container} onPress={() => goBack()} icon={'arrow-left'} />
);

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top:  getStatusBarHeight() + 16,
		left: 16,
	},
});

export default memo(BackButton);
