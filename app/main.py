from fastapi import FastAPI

from app.routers.user import user
import sys

print(sys.path)

app = FastAPI()
# app.include_router(user)


@app.get("/")
def read_root():
    return {"Hello": "World"}
