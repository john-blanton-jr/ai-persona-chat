from fastapi import APIRouter

from models.user import User
from config.db import db
from schemas.user import serializeDict, serializeList
from bson import ObjectId

user = APIRouter()


@user.get("/")
async def find_all_users():
    # print(db.local.user.find())
    # print(serializeList(db.local.user.find()))
    return serializeList(db.local.user.find())


@user.get("/{id}")
async def find_one_user(id):
    return serializeDict(db.local.user.find_one({"_id": ObjectId(id)}))


@user.post("/")
async def create_user(user: User):
    db.local.user.insert_one(dict(user))
    return serializeList(db.local.user.find())


@user.put("/{id}")
async def update_user(id, user: User):
    db.local.user.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(user)})
    return serializeDict(db.local.user.find_one({"_id": ObjectId(id)}))


@user.delete("/{id}")
async def delete_user(id, user: User):
    return serializeDict(db.local.user.find_one_and_delete({"_id": ObjectId(id)}))
