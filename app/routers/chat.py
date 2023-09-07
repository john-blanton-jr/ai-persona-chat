from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import openai
import os
from dotenv import load_dotenv
from config.db import db
from fastapi import APIRouter
from bson import ObjectId

chat = APIRouter()

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")

persona_collection = db["personas"]


class ChatMessage(BaseModel):
    role: str  # Added role to differentiate between user and assistant messages
    message: str
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
    user_id: str
    persona_name: str
    message: str


def json_encoder(o):
    if isinstance(o, ObjectId):
        return str(o)
    if isinstance(o, dict):
        return {
            key: (str(value) if isinstance(value, ObjectId) else value)
            for key, value in o.items()
        }
    raise TypeError(f"Object of type {o.__class__.__name__} is not JSON serializable")


@chat.post("/add_persona")
async def add_persona(persona: Persona):
    persona_data = persona.dict()
    if "chat_history" not in persona_data:
        persona_data["chat_history"] = {"user_id": "", "messages": []}
    persona_collection.insert_one(persona_data)
    return {"message": "Persona added successfully"}


@chat.get("/get_personas")
async def get_personas():
    personas_cursor = persona_collection.find()
    personas_list = [json_encoder(persona) for persona in personas_cursor]
    return personas_list


@chat.get("/switch_persona")
async def switch_persona(request: SwitchPersonaRequest):
    print(
        f"Switching persona, received user_id: {request.user_id}, new_persona_name: {request.new_persona_name}"
    )  # Log received user_id and new_persona_name

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
    print(
        f"Received user_id: {user_id}, persona_name: {persona_name}"
    )  # Log received user_id and persona_name
    user_persona = persona_collection.find_one({"name": persona_name})
    if user_persona:
        chat_history = user_persona.get("chat_history", {"user_id": "", "messages": []})
        print(f"Database user_id: {chat_history['user_id']}")  # Log database user_id
        if chat_history["user_id"] == user_id:
            print(
                f"Chat history: {chat_history['messages']}"
            )  # Log retrieved chat history
            return chat_history["messages"]
        else:
            return []  # Return an empty array instead of raising an error
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Persona named '{persona_name}' not found. Please check the name and try again.",
        )


@chat.post("/send_message")
async def send_message(request: SendMessageRequest):
    openai.api_key = openai_key

    # Find the persona in the database and get the chat history
    user_persona = persona_collection.find_one({"name": request.persona_name})
    if user_persona:
        chat_history = user_persona.get("chat_history", {"messages": []})
    else:
        return {"error": "Persona not found"}

    # Construct the user message object
    user_message = {
        "role": "user",
        "message": request.message,
        "persona_name": request.persona_name,
    }

    # Add the new user message to the chat history
    chat_history["messages"].append(user_message)

    # Prepare the messages parameter with the full chat history
    messages_param = [
        {"role": msg["role"], "content": msg["message"]}
        for msg in chat_history["messages"]
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages_param,
        )
    except openai.error.OpenAIError as e:
        return {"error": str(e)}

    # Construct the new message response
    new_message = {
        "role": "assistant",
        "message": response["choices"][0]["message"]["content"],
        "persona_name": request.persona_name,
    }

    # Add the new assistant message to the chat history
    chat_history["messages"].append(new_message)

    # Update the chat history in the database
    persona_collection.update_one(
        {"name": request.persona_name},
        {"$set": {"chat_history.messages": chat_history["messages"]}},
        upsert=True,  # This will insert a new document if the persona is not found
    )

    # Return the response from ChatGPT and updated message history
    return {"response": new_message}


@chat.delete("/delete_chat_history")
async def delete_chat_history(user_id: str, persona_name: str):
    user_persona = persona_collection.find_one({"name": persona_name})
    if user_persona:
        persona_collection.update_one(
            {"name": persona_name},
            {"$set": {"chat_history": {"user_id": user_id, "messages": []}}},
        )
        return {"message": "Chat history deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Persona not found")
