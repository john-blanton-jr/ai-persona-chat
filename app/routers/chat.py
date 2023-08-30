import os
import traceback
import requests
from typing import List
from bson import ObjectId
from config.db import conn
from dotenv import load_dotenv
from fastapi import APIRouter, Query, HTTPException
from schemas.user import (
    serializeList,
)  # Assuming this is where your serializeList function is defined
from fastapi.responses import JSONResponse

from models.chat import ChatInput, PersonaInput, UserInput

load_dotenv()

openapi_key = os.getenv("OPENAI_API_KEY")

chat_history_collection = conn.local.chat_history

chat = APIRouter()


def get_persona_details(persona_id):
    try:
        result = conn.local.personas.find_one({"_id": ObjectId(persona_id)})
        if result is None:
            print(f"No document found for persona_id: {persona_id}")
            # Debug line: Print a few documents to check the data
            sample_data = conn.local.personas.find().limit(5)
            print(f"Sample data: {list(sample_data)}")
        else:
            print(f"Querying for persona_id: {persona_id}, Result: {result}")
        return result
    except Exception as e:
        traceback.print_exc()
        print(f"Error fetching persona details: {e}")
        return None


def chat_with_gpt3_5(prompt, persona_id, chat_history=None):
    try:
        persona_details = get_persona_details(persona_id)
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {openapi_key}"}
        system_message_content = "Default System Message"
        if persona_details is not None:
            system_message_content = persona_details["description"]
        else:
            print("Persona details not found.")
        messages = [{"role": "system", "content": system_message_content}]
        if chat_history:
            for item in chat_history:
                messages.append({"role": "user", "content": item["user_message"]})
                messages.append({"role": "assistant", "content": item["chatbot_reply"]})
        messages.append({"role": "user", "content": prompt})
        data = {"model": "gpt-3.5-turbo", "messages": messages}
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        response_data = response.json()
        return response_data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        traceback.print_exc()
        print(f"HTTP Request error: {e}")
        return "An error occurred while talking to the chatbot."


@chat.post("/chat")
async def chat_endpoint(
    chat_input: ChatInput, user_id: str = Query(...), persona_id: str = Query(...)
):
    print(f"Debug: Searching for persona_id: {persona_id}, user_id: {user_id}")
    try:
        user_message = chat_input.user_message
        history = list(
            chat_history_collection.find({"user_id": user_id, "persona_id": persona_id})
        )
        serialized_history = serializeList(history)
        chatbot_reply = chat_with_gpt3_5(user_message, persona_id, serialized_history)

        # Insert the chat history and get the inserted_id
        new_chat = chat_history_collection.insert_one(
            {
                "user_id": user_id,
                "persona_id": persona_id,
                "user_message": user_message,
                "chatbot_reply": chatbot_reply,
            }
        )

        # Return the chatbot reply and the new chat_id
        return {"chatbot_reply": chatbot_reply, "chat_id": str(new_chat.inserted_id)}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@chat.post("/add_user")
async def add_user(user_input: UserInput):
    new_user = conn.local.users.insert_one(user_input.dict())
    return {"message": "User added successfully", "user_id": str(new_user.inserted_id)}


@chat.post("/add_persona")
async def add_persona(persona_input: PersonaInput):
    new_persona = conn.local.personas.insert_one(persona_input.dict())
    return {
        "message": "Persona added successfully",
        "persona_id": str(new_persona.inserted_id),
    }


@chat.get("/get_chat_history")
async def get_chat_history(user_id: str, persona_id: str):
    print(f"Debug: Searching for persona_id: {persona_id}, user_id: {user_id}")
    history = list(
        chat_history_collection.find({"user_id": user_id, "persona_id": persona_id})
    )
    print("Debug: Chat History Raw: ", history)

    # Convert ObjectId to string
    for record in history:
        record["_id"] = str(record["_id"])

    if history:
        serialized_history = serializeList(history)
        return JSONResponse(content={"chat_history": serialized_history})
    else:
        return JSONResponse(
            content={"message": "No chat history found"}, status_code=404
        )
