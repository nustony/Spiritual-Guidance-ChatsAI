import { Colors } from '@/constants/Colors';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
	safeView: {
		flex: 1,
		backgroundColor: Colors.main
	},
	container: {
		flex: 1,
		backgroundColor: Colors.main
	},
	view: {
		flex: 1,
	},
	flatlist: {
		flex: 1,
		marginBottom: 75,
		backgroundColor: Colors.main
	},
	containerFlatlist: {
		paddingBottom: 120
	},
	containerFooter: {
		width: width,
		minHeight: 50,
		position: 'absolute',
		bottom: 20,
		left: 0,
		right: 0,
	},
	containerInput: {
		width: width - 16,
		minHeight: 50,
		maxHeight: 200,
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		borderRadius: 25,
		backgroundColor: Colors.white,
		marginHorizontal: 8
	},
	input: {
		flex: 1,
		paddingHorizontal: 16,
		color: Colors.black,
		textAlign: 'left',
		textAlignVertical: 'center',
		paddingTop: Platform.OS == 'ios' ? 16 : 4
	},
	iconSend: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		marginLeft: 10
	},
	button: {
		width: 80,
		height: 44,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 3,
		backgroundColor: 'white',
		borderColor: Colors.black,
		borderWidth: 1,
		alignSelf: 'center'
	},
	header: {
		height: 50,
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: Colors.white,
		paddingLeft: 20
	},
	title: {
		color: Colors.white,
		fontSize: 18
	},
	userView: {
		borderRadius: 8,
		backgroundColor: Colors.grey,
		alignSelf: 'flex-end',
		margin: 16,
		padding: 8,
		maxWidth: '80%'
	},
	botView: {
		borderRadius: 8,
		backgroundColor: Colors.white,
		alignSelf: 'flex-start',
		margin: 16,
		padding: 8,
		maxWidth: '80%'
	},
	textUserContent: {
		color: Colors.white,
		fontSize: 16
	},
	textContent: {
		color: 'black',
		fontSize: 16
	},
	loadingView: {
		borderRadius: 8,
		backgroundColor: Colors.white,
		alignSelf: 'flex-start',
		margin: 10,
		padding: 8,
		maxWidth: '80%'
	},
	textSuggest: {
		color: Colors.black,
		fontSize: 14
	},
	containerSuggest: {
		borderRadius: 25,
		backgroundColor: Colors.white,
		borderWidth: 1,
		borderColor: Colors.black,
		padding: 8,
		margin: 2
	},
	scroll: {
		padding: 8,
	},
	containerScroll: {
		paddingRight: 20
	},
	containerViewScroll: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: 8,
		marginBottom: 4
	},
	bottomView: {
		height: 120
	}
})
