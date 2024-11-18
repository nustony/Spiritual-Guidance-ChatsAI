import React from 'react'

export interface IMessage {
	role: "user" | "assistant" | 'loading',
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
