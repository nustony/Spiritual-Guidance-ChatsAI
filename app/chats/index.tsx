import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Dimensions, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Image, Text, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { IAIResponse, IMessage } from '../../constants/interface'
import { images } from '@/constants/images';
import axios from 'axios';
import { API_TOKEN } from '@/constants/key';

const { width, height } = Dimensions.get('window')
const Chats = () => {

	const [data, setData] = useState<IMessage[]>([])
	const [input, setInput] = useState<string>('')
	const [suggestions, setSuggestions] = useState<string[]>([])

	const suggestRef = useRef<ScrollView>(null)
	const flatlistRef = useRef<FlatList>(null)

	const onSendContent = useCallback(async (content: string) => {
		const message: IMessage = {
			role: 'user',
			content: content
		}
		const loadingMessage: IMessage = {
			role: 'loading',
			content: ''
		}
		setData(prev => [...prev, message, loadingMessage])
		setInput("")
		try {
			const response: IAIResponse = await axios.post('https://api.openai.com/v1/chat/completions',
				{
					"model": "gpt-4o",
					"messages": [{
						role: 'system',
						content: `You are a Christian spiritual mentor offering guidance and emotional support. Always answer questions and provide exactly 3 related suggestions. Respond in this format:\n\nAnswer: <Your answer>\nSuggestions:\n1. <Suggestion 1>\n2. <Suggestion 2>\n3. <Suggestion 3>`,
						//content: 'Pretend as a Christian spiritual mentor offering guidance and emotional support .Always answer questions and provide exactly 3 related suggestions that the user might want to ask next.'
					},
					...data, message
					],
				}, {
				headers: {
					Authorization: `Bearer ${API_TOKEN}`,
					"Content-Type": "application/json"
				}
			}
			)
			console.log("==> AI ", response.data.choices?.[0]);

			if (response.data?.choices.length != 0) {
				const responseContent = response.data.choices[0].message.content;
				const [answer, suggestionsBlock] = responseContent.split("Suggestions:");

				const suggestions = suggestionsBlock
					? suggestionsBlock
						.split("\n")
						.filter((line) => line.trim())
						.map((s) => s.replace(/^\d+\.\s*/, "").trim())
					: [];

				const botMessage: IMessage = {
					role: 'assistant',
					content: answer.trim() == "" ? "I haven't found the answer yet, you can ask another question." : answer.trim().replace("Answer:", "").trim()
				}

				suggestRef?.current?.scrollTo({ x: 0, animated: true })
				setSuggestions(suggestions)
				setData(prev => [...prev, botMessage].filter((item: IMessage) => item.role != 'loading'))
			}
		}
		catch (error) {
			console.log("send error ", error);
		}
	}, [data, suggestRef, flatlistRef, setInput, setSuggestions])

	const onPressSend = useCallback(async () => {
		if (input.trim() == '') return;
		onSendContent(input)
	}, [input, onSendContent])

	const _renderMessage = useCallback(({ item, index }: { item: IMessage, index: number }) => {
		if (item.role == 'loading') return <View style={styles.loadingView}>
			<ActivityIndicator color={'black'} />
		</View>
		return <View style={item.role == 'user' ? styles.userView : styles.botView}>
			<Text style={item.role == 'user' ? styles.textUserContent : styles.textContent}>{item.content}</Text>
		</View>
	}, [])

	const onPressSuggest = useCallback((item: string) => {
		setSuggestions([])
		onSendContent(item)
	}, [setSuggestions, onSendContent])

	const _renderFooter = useCallback(() => {
		return (
			<View style={styles.containerFooter}>
				<View style={styles.containerViewScroll}>
					{suggestions.map((item: string, index: number) => (
						<TouchableOpacity onPress={() => onPressSuggest(item)} key={index} style={styles.containerSuggest}>
							<Text style={styles.textSuggest} numberOfLines={1}>{item}</Text>
						</TouchableOpacity>
					))}
				</View>
				<View style={styles.containerInput}>
					<TextInput value={input} style={styles.input} multiline placeholder='Input....' onChangeText={setInput} />
					{input.trim() != "" && <TouchableOpacity disabled={input.trim() == ''} onPress={onPressSend} style={styles.button}>
						<Image source={images.send} style={styles.iconSend} />
					</TouchableOpacity>}
				</View>
			</View>
		)
	}, [input, suggestions, suggestRef, setInput, onPressSend, onPressSuggest])

	const _renderEmpty = useCallback(() => {
		return <View style={styles.botView}>
			<Text style={styles.textContent}>Hello, I’m here to support and listen to you. Please feel free to share what’s on your heart or mind.</Text>
		</View>
	}, [])

	useEffect(() => {
		if (flatlistRef.current) {
			setTimeout(() => {
				flatlistRef.current?.scrollToEnd({ animated: true})
			}, 1000);
		}
	}, [data])

	return (<SafeAreaView style={styles.safeView}>
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<View style={styles.view}>
				<View style={styles.header}>
					<Text style={styles.title}>Spiritual Guidance</Text>
				</View>
				<View style={styles.view}>
					<FlatList
						data={data}
						ref={flatlistRef}
						ListEmptyComponent={() => _renderEmpty()}
						renderItem={_renderMessage}
						style={styles.flatlist}
						contentContainerStyle={styles.containerFlatlist}
						keyExtractor={(item: IMessage, index: number) => `${index}`}
					/>
				</View>
				{_renderFooter()}
			</View>
		</KeyboardAvoidingView>
	</SafeAreaView>)
}


const styles = StyleSheet.create({
	safeView: {
		flex: 1,
		backgroundColor: '#353740'
	},
	container: {
		flex: 1,
		backgroundColor: '#353740'
	},
	view: {
		flex: 1,
	},
	flatlist: {
		flex: 1,
		marginBottom: 75,
		backgroundColor: '#353740'
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
		backgroundColor: 'white',
		marginHorizontal: 8
	},
	input: {
		flex: 1,
		paddingHorizontal: 16,
		color: 'black'
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
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'center'
	},
	header: {
		height: 50,
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: 'white',
		paddingLeft: 20
	},
	title: {
		color: 'white',
		fontSize: 18
	},
	userView: {
		borderRadius: 8,
		backgroundColor: 'grey',
		alignSelf: 'flex-end',
		margin: 16,
		padding: 8,
		maxWidth: '80%'
	},
	botView: {
		borderRadius: 8,
		backgroundColor: 'white',
		alignSelf: 'flex-start',
		margin: 16,
		padding: 8,
		maxWidth: '80%'
	},
	textUserContent: {
		color: 'white',
		fontSize: 16
	},
	textContent: {
		color: 'black',
		fontSize: 16
	},
	loadingView: {
		borderRadius: 8,
		backgroundColor: 'white',
		alignSelf: 'flex-start',
		margin: 10,
		padding: 8,
		maxWidth: '80%'
	},
	textSuggest: {
		color: 'black',
		fontSize: 14
	},
	containerSuggest: {
		borderRadius: 25,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: 'black',
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
	}
})

export default Chats;
