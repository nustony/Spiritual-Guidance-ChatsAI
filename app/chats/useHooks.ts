import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { String } from '@/constants/Strings';
import { IAIResponse, IMessage } from '../../constants/Interfaces';
import { ROLE } from '@/constants/Constants';
import { APIs } from '@/constants/APIs';
import { TOKEN_KEY } from '@env';

const useHooks = () => {
	const [data, setData] = useState<IMessage[]>([])
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [input, setInput] = useState<string>('')

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
			const response: IAIResponse = await axios.post(APIs.COMPLETIONS,
				{
					"model": "gpt-4o",
					"messages": [{
						role: ROLE.system,
						content: String.content,
					},
					...data, message
					],
				}, {
				headers: {
					Authorization: `Bearer ${TOKEN_KEY}`,
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
					role: ROLE.assistant,
					content: answer.trim() == "" ? String.notFound : answer.trim().replace("Answer:", "").trim()
				}

				setSuggestions(suggestions)
				setData(prev => [...prev, botMessage].filter((item: IMessage) => item.role != ROLE.loading))
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
