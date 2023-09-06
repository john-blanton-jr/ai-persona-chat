from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import openai
import os
from dotenv import load_dotenv
from config.db import db
from fastapi import APIRouter

chat = APIRouter()


load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")


persona_collection = db["personas"]


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


class SendMessageRequest(BaseModel):
    persona_name: str
    message: str


@chat.post("/add_persona")
async def add_persona(persona: Persona):
    persona_data = persona.dict()
    persona_collection.insert_one(persona_data)
    return {"message": "Persona added successfully"}


@chat.get("/switch_persona")
async def switch_persona(request: SwitchPersonaRequest):
    user_persona = persona_collection.find_one({"name": request.new_persona_name})
    if user_persona:
        persona_collection.update_one(
            {"name": request.new_persona_name},
            {"$set": {"chat_history.user_id": request.user_id}},
        )
        return {"message": f"Switched to persona: {request.new_persona_name}"}
    else:
        raise HTTPException(status_code=404, detail="Persona not found")


@chat.get("/get_chat_history")
async def get_chat_history(user_id: str, persona_name: str):
    user_persona = persona_collection.find_one({"name": persona_name})
    if user_persona:
        chat_history = user_persona["chat_history"]
        if chat_history["user_id"] == user_id:
            return chat_history["messages"]
        else:
            raise HTTPException(
                status_code=401, detail="Unauthorized access to chat history"
            )
    else:
        raise HTTPException(status_code=404, detail="Persona not found")


@chat.post("/send_message")
async def send_message(request: SendMessageRequest):
    # Your code for interacting with ChatGPT and updating MongoDB chat history
    # ...
    # Construct the new message response
    new_message = {
        "message": response["choices"][0]["message"]["content"],
        "timestamp": "current_timestamp",  # Replace with actual timestamp
        "persona_name": "GeekMaster",  # Replace with ChatGPT's persona name
    }
    # Return the response from ChatGPT and updated message history
    return {"response": new_message}
