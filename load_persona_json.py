import requests
import json

url = "http://localhost:8000/chat/add_persona"

# Load personas from the JSON file
with open("personas.json", "r") as file:
    personas = json.load(file)

# Post each persona to the FastAPI endpoint
for persona in personas:
    response = requests.post(url, json=persona)
    print(response.json())
