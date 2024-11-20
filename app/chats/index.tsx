import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, SafeAreaView, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { IMessage } from '@/constants/Interfaces'
import { StringsText } from '@/constants/Strings';
import styles from './styles';
import useHooks from './useHooks';
import { ROLE } from '@/constants/Constants';
import { Colors } from '@/constants/Colors';
import { images } from '@/constants/Images';

const Chats = () => {

	const { input, setInput, data, suggestions, setSuggestions, onSendContent } = useHooks()

	const flatlistRef = useRef<FlatList>(null)

	const onPressSend = useCallback(() => {
		if (input.trim() == '') return;
		onSendContent(input)
	}, [input, onSendContent])

	const _renderMessage = useCallback(({ item, index }: { item: IMessage, index: number }) => {
		if (item.role == ROLE.loading) return <View style={styles.loadingView}>
			<ActivityIndicator color={Colors.black} />
		</View>
		return <View style={item.role == ROLE.user ? styles.userView : styles.botView}>
			<Text style={item.role == ROLE.user ? styles.textUserContent : styles.textContent}>{item.content}</Text>
		</View>
	}, [])

	const onPressSuggest = useCallback((item: string) => {
		setSuggestions([])
		onSendContent(item)
	}, [setSuggestions, onSendContent])

	const _renderBottomView = useCallback(() => (<View style={styles.bottomView} />), [])

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
					<TextInput value={input} style={styles.input} multiline placeholder='Input....' onChangeText={setInput} placeholderTextColor={Colors.grey} />
					{input.trim() != "" && <TouchableOpacity disabled={input.trim() == ''} onPress={onPressSend} style={styles.button}>
						<Image source={images.send} style={styles.iconSend} />
					</TouchableOpacity>}
				</View>
			</View>
		)
	}, [input, suggestions, setInput, onPressSend, onPressSuggest])

	const loadData = useMemo<IMessage[]>(() => [
		{
			role: ROLE.assistant,
			content: StringsText.firstMessage
		}
		, ...data
	], [data])

	useEffect(() => {
		if (flatlistRef.current) {
			setTimeout(() => {
				flatlistRef.current?.scrollToEnd({ animated: true })
			}, 200);
		}
	}, [data])

	return (<SafeAreaView style={styles.safeView}>
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
			style={styles.container}>
			<View style={styles.view}>
				<View style={styles.header}>
					<Text style={styles.title}>{StringsText.appName}</Text>
				</View>
				<View style={styles.view}>
					<FlatList
						data={loadData}
						ref={flatlistRef}
						renderItem={_renderMessage}
						style={styles.flatlist}
						contentContainerStyle={styles.containerFlatlist}
						keyExtractor={(item: IMessage, index: number) => `${ index}`}
						ListFooterComponent={_renderBottomView}
					/>
				</View>
				{_renderFooter()}
			</View>
		</KeyboardAvoidingView>
	</SafeAreaView>)
}

export default Chats;
