import { useCallback, useEffect, useState } from 'react';
import { StringsText } from '@/constants/Strings';
import { IMessage, IResponse } from '../../constants/Interfaces';
import { ROLE, SCHEMA } from '@/constants/Constants';
import { TOKEN_KEY } from '@/constants/Keys';
import OpenAI from "openai";

const useHooks = () => {
	const [data, setData] = useState<IMessage[]>([])
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [input, setInput] = useState<string>('')
	const openai = new OpenAI({ apiKey: TOKEN_KEY });

	const onSendContent = useCallback(async (content: string) => {
		const message: IMessage = {
			role: ROLE.user,
			content: content
		}
		const loadingMessage: IMessage = {
			role: ROLE.loading,
			content: ''
		}
		setData(prev => [...prev, message, loadingMessage])
		setInput("")
		try {
			const response = await openai.beta.chat.completions.parse({
				model: 'gpt-4o-2024-08-06',
				messages: [{
					role: ROLE.system,
					content: StringsText.content,
				},
				...data, message
				],
				response_format: SCHEMA,
			}
			)
			console.log("==> AI ", response.choices[0].message.parsed);
			if (response.choices.length != 0) {
				const parsedData: IResponse | null = response.choices[0].message.parsed
				if (parsedData != null) {
					setSuggestions(parsedData.suggestions)
					const botMessage: IMessage = {
						role: ROLE.assistant,
						content: parsedData.answer.trim() == "" ? StringsText.notFound : parsedData.answer.trim().replace("Answer:", "").trim()
					}
					setData(prev => [...prev, botMessage].filter((item: IMessage) => item.role != ROLE.loading))
				}
			}
		}
		catch (error) {
			console.log("send error ", error);
		}
	}, [data, setInput, setSuggestions])

	useEffect(() => {
		setData([])
		setSuggestions([])
	}, [])

	return {
		data,
		suggestions,
		setSuggestions,
		input,
		setInput,
		onSendContent
	}
}

export default useHooks;
