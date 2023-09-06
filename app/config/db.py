import os
from pymongo import MongoClient

client = MongoClient("mongodb://root:example@mongodb:27017/")
db = client[os.getenv("DATABASE_NAME")]
