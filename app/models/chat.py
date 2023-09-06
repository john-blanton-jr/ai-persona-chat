from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    message: str
    timestamp: str
    persona_name: str


class ChatHistory(BaseModel):
    user_id: str
    messages: List[ChatMessage]


class Persona(BaseModel):
    name: str
    avatar: str
    description: str
    short_description: str
    chat_history: ChatHistory


class SwitchPersonaRequest(BaseModel):
    user_id: str
    new_persona_name: str
