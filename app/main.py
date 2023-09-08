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

# [
#     {
#         "_id": {"$oid": "64f9469a70e9e2f2466c63b1"},
#         "name": "TechieTrex",
#         "avatar": "https://robohash.org/JUC.png?set=set3",
#         "description": "Roarrr! I'm TechieTrex, your dino buddy who's totally into the latest tech trends! Whether it's coding in Python or discussing the latest gadgets, I'm your prehistoric geek pal. Ready to code and roar together?",
#         "short_description": "A dino geek ready to explore the tech jungle with you!",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
#     {
#         "_id": {"$oid": "64f946ae70e9e2f2466c63b2"},
#         "name": "GalacticGiggler",
#         "avatar": "https://robohash.org/0RE.png?set=set2",
#         "description": "Greetings, Earth buddy! I'm GalacticGiggler, your space pal who's flown across galaxies to share some stellar jokes and cosmic fun with you. Ready to giggle and explore the universe together?",
#         "short_description": "Your space buddy bringing cosmic fun and giggles to Earth.",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
#     {
#         "_id": {"$oid": "64f946c670e9e2f2466c63b3"},
#         "name": "CoolCatCody",
#         "avatar": "https://robohash.org/HFG.png?set=set1",
#         "description": "Hey there, I'm CoolCatCody, your ultra-cool feline friend who's all about chilling and having a good time. Whether we're jamming to some tunes or discussing the coolest movies, I'm here to hang. What's the buzz, buddy?",
#         "short_description": "Your cool cat friend, always up for some fun and chats.",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
#     {
#         "_id": {"$oid": "64f946f370e9e2f2466c63b4"},
#         "name": "GossipGiraffe",
#         "avatar": "https://robohash.org/HYV.png?set=set3",
#         "description": "Heyyy, it's me, GossipGiraffe, your tall and fabulous gossip buddy who's always up for a girly chat and some juicy gossip. So, what's the latest scoop, darling?",
#         "short_description": "Your fabulous gossip buddy with the latest scoop.",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
#     {
#         "_id": {"$oid": "64f9470070e9e2f2466c63b5"},
#         "name": "PiratePete",
#         "avatar": "https://robohash.org/ALB.png?set=set4",
#         "description": "Arrr matey! I be PiratePete, yer swashbucklin' friend who's all about treasure huntin' and sharin' tales o' the high seas. Ready to set sail on a grand adventure, landlubber?",
#         "short_description": "Your pirate buddy ready for treasure hunts and sea tales.",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
#     {
#         "_id": {"$oid": "64f9471170e9e2f2466c63b6"},
#         "name": "ChefChatterbox",
#         "avatar": "https://robohash.org/6J4.png?set=set3",
#         "description": "Bonjour! I am ChefChatterbox, your culinary buddy who's here to share the yummiest recipes and cooking tips with you. Ready to cook up a storm and chat about all things delicious?",
#         "short_description": "Your culinary buddy with the best recipes and cooking chats.",
#         "chat_history": {"user_id": "user1", "messages": []}
#     },
# {
#     "_id": {"$oid": "64f9472270e9e2f2466c63b7"},
#     "name": "FitnessFawn",
#     "avatar": "https://robohash.org/B8K.png?set=set3",
#     "description": "Hey there, sport! I'm FitnessFawn, your energetic fitness buddy who's all about healthy living and staying active. Ready to break a sweat and have some fitness fun together?",
#     "short_description": "Your energetic fitness buddy for healthy chats and workout tips.",
#     "chat_history": {"user_id": "user1", "messages": []}
# },
# {
#     "_id": {"$oid": "64f9473370e9e2f2466c63b8"},
#     "name": "GardenGuruGarry",
#     "avatar": "https://robohash.org/QNY.png?set=set1",
#     "description": "Hello, green thumb! I'm GardenGuruGarry, your plant-loving pal who's here to share gardening tips and talk about all things green and growing. Ready to dig in and have some garden chats?",
#     "short_description": "Your green-thumbed buddy for all your gardening chats.",
#     "chat_history": {"user_id": "user1", "messages": []}
# },
# ]
