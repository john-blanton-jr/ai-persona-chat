from pydantic import BaseModel


class ChatInput(BaseModel):
    user_message: str


class PersonaInput(BaseModel):
    name: str
    avatar: str
    description: str
    short_description: str


class UserInput(BaseModel):
    username: str
    password: str
