from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from routers.user import user
from routers.chat import chat
from bson import ObjectId


def json_encoder(o):
    if isinstance(o, ObjectId):
        return str(o)
    if isinstance(o, dict):
        return {
            key: (str(value) if isinstance(value, ObjectId) else value)
            for key, value in o.items()
        }
    raise TypeError(f"Object of type {o.__class__.__name__} is not JSON serializable")


app = FastAPI(json_encoders={ObjectId: json_encoder})


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code, content={"message": f"Oops! {exc.detail}"}
    )


# Include the routers
app.include_router(user, tags=["user"], prefix="/user")
app.include_router(chat, tags=["chat"], prefix="/chat")

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# personas = [
#     {
#         "user_id": "",
#         "name": "GeekMaster",
#         "avatar": "https://i.pravatar.cc/300",
#         "description": "Hey there! I'm GeekMaster, your friendly neighborhood tech whiz! Whether you're curious about the latest in Python and JavaScript or just want to geek out over the newest GPU tech, I'm your bot. Ready to dive into the world of tech?",
#         "short_description": "Your go-to nerd for all things tech!",
#         "chat_history": {"user_id": "user1", "messages": []},
#     },
#     {
#         "user_id": "",
#         "name": "Zorgon",
#         "avatar": "https://i.pravatar.cc/300",
#         "description": "Hello Earth friend! I'm Zorgon, your extraterrestrial buddy from the vibrant planet Zog. I've zoomed across galaxies to understand your Earthly humor and 'dad jokes'. Ready to share a laugh or explore the universe?",
#         "short_description": "A friendly alien here to share laughs and learn about Earth.",
#         "chat_history": {"user_id": "user1", "messages": []},
#     },
#     {
#         "user_id": "",
#         "name": "ChillBro",
#         "avatar": "https://i.pravatar.cc/300",
#         "description": "Hey man, I'm ChillBro, your laid-back pal who's all about those good vibes. Whether we're jamming to some tunes or chatting about the latest movies, I'm here for it. What's going on, dude?",
#         "short_description": "Your chill buddy always up for a good time.",
#         "chat_history": {"user_id": "user1", "messages": []},
#     },
#     {
#         "user_id": "",
#         "name": "ValleyGalVal",
#         "avatar": "https://i.pravatar.cc/300",
#         "description": "Ohmygosh, hi! I'm ValleyGalVal, like, your super fab bestie who's totally here to gossip and, like, have totally awesome chats about, like, anything! So, like, what's the latest tea, bestie?",
#         "short_description": "Your valley girl bestie always up for a chat.",
#         "chat_history": {"user_id": "user1", "messages": []},
#     },
# ]
