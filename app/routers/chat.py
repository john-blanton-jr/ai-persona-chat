from dotenv import load_dotenv
import os
from pymongo import MongoClient
import requests
import uuid
from schemas.user import serializeList
from fastapi import APIRouter
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Retrieve API key from .env
openapi_key = os.getenv("OPENAI_API_KEY")

# MongoDB connection
conn = MongoClient("mongodb://mongodb:27017/")
chat_history_collection = conn.local.chat_history
session_collection = conn.local.session_ids

# FastAPI app
chat = APIRouter()


def generate_session_id():
    return str(uuid.uuid4())


def calculate_total_tokens(messages):
    return sum(len(msg["content"].split()) for msg in messages)


@chat.post("/chat/start/")
async def start_chat_session():
    session_id = generate_session_id()
    session_collection.insert_one({"session_id": session_id})
    return {"session_id": session_id}


def validate_session_id(session_id: str):
    return session_collection.find_one({"session_id": session_id}) is not None


# Global variables to store observed token usage
observed_prompt_tokens = 0
observed_completion_tokens = 0


def chat_with_gpt3_5(prompt, chat_history=None):
    global observed_prompt_tokens, observed_completion_tokens
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {openapi_key}"}
    MAX_TOKENS = 3950  # Lower than actual limit as a buffer

    # Dynamically adjust TOKEN_BUFFER based on observed token usage
    TOKEN_BUFFER = observed_prompt_tokens + observed_completion_tokens + 50

    messages = [
        {
            "role": "system",
            "content": "You are a computer nerd. You love talking about programming, tech trends, and all things computer-related. And sometimes nerd funny",
        }
    ]

    if chat_history:
        for item in chat_history:
            messages.append({"role": "user", "content": item["user_message"]})
            messages.append({"role": "assistant", "content": item["chatbot_reply"]})

    messages.append({"role": "user", "content": prompt})

    total_tokens = calculate_total_tokens(messages) + TOKEN_BUFFER  # Add buffer

    while total_tokens > MAX_TOKENS and len(messages) > 2:
        removed_user_msg = messages.pop(0)
        removed_assistant_msg = messages.pop(0)
        total_tokens -= len(removed_user_msg["content"].split()) + len(
            removed_assistant_msg["content"].split()
        )

    data = {"model": "gpt-3.5-turbo", "messages": messages}

    response = requests.post(url, headers=headers, json=data)
    response_data = response.json()

    if "usage" in response_data:
        print("Token Usage:", response_data["usage"])  # Print token usage info
        observed_prompt_tokens = response_data["usage"]["prompt_tokens"]
        observed_completion_tokens = response_data["usage"]["completion_tokens"]

    try:
        return response_data["choices"][0]["message"]["content"].strip()
    except KeyError:
        print("Error: ", response_data)
        return "An error occurred while talking to the chatbot."


class ChatInput(BaseModel):
    user_message: str


@chat.post("/chat/")
async def chat_endpoint(chat_input: ChatInput, session_id: str):
    if not validate_session_id(session_id):
        return {"error": "Invalid session ID"}

    user_message = chat_input.user_message
    history = list(chat_history_collection.find({"session_id": session_id}))
    serialized_history = serializeList(history)

    chatbot_reply = chat_with_gpt3_5(user_message, serialized_history)

    chat_history_collection.insert_one(
        {
            "session_id": session_id,
            "user_message": user_message,
            "chatbot_reply": chatbot_reply,
        }
    )

    return {"chatbot_reply": chatbot_reply}


@chat.get("/chat/history/{session_id}/")
async def get_chat_history(session_id: str):
    try:
        history = list(chat_history_collection.find({"session_id": session_id}))
        serialized_history = serializeList(history)
        return {"chat_history": serialized_history}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while fetching chat history"}


@chat.get("/chat/summary/{session_id}/")
async def get_chat_summary(session_id: str):
    try:
        history = list(chat_history_collection.find({"session_id": session_id}))
        serialized_history = serializeList(history)
        summary = summarize_chat(serialized_history)
        return {"chat_summary": summary}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while fetching chat summary"}


def summarize_chat(serialized_chat_history):
    chat_text = "\n".join(
        [
            f"User: {item['user_message']}\nBot: {item['chatbot_reply']}"
            for item in serialized_chat_history
        ]
    )
    summary = chat_with_gpt3_5(f"Summarize the following chat:\n{chat_text}")
    return summary
