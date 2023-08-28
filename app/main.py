from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers.user import user
from routers.chat import chat

# Assuming movie_data is an APIRouter object

app = FastAPI()

# Include the routers
app.include_router(user, tags=["user"], prefix="/user")
app.include_router(chat, tags=["chat"], prefix="/chat")


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
