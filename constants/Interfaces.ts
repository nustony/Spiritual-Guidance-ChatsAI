import {  ChatCompletionMessageParam } from "openai/resources"
import { ROLE } from "./Constants"

export interface IMessage  {
	role: ROLE.user | ROLE.assistant | ROLE.loading ,
	content: string
}

export interface IAIResponse {
	data: IDataResponse
}

export interface IDataResponse {
	choices: IChoice[]
}

export interface IChoice {
	message: IResponseMessage
}

export interface IResponseMessage {
	content: string
}

export interface IResponse {
	answer: string,
	suggestions: string[]
}
