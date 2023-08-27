from pydantic import BaseModel


class User(BaseModel):
    name: str
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Johnny B",
                "email": "john@johnnybcodes.com",
                "password": "password123",
            }
        }
