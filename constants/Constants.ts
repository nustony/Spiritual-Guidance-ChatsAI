
enum ROLE {
	user = "user",
	assistant = "assistant",
	loading = "loading",
	system = "system"
}

const SCHEMA = {
	type: "json_schema",
	json_schema: {
		"name": "chats_schema",
		"strict": true,
		"schema": {
			"type": "object",
			"properties": {
				"answer": {
					"type": "string",
					"description": "The answer for question"
				},
				"suggestions": {
					"type": "array",
					"description": "The list sugggestions for the next question, Always response 3 items",
					"items": {
							"type": "string",
					},
				}
			},
			"required": ["answer", "suggestions"],
			"additionalProperties": false
		}
	}
}

export {
	ROLE,
	SCHEMA
}
