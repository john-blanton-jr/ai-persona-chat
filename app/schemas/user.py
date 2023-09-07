from bson import ObjectId


def json_encoder(o):
    if isinstance(o, ObjectId):
        return str(o)
    raise TypeError(f"Object of type {o.__class__.__name__} is not JSON serializable")


def serializeDict(a) -> dict:
    return {
        **{i: str(a[i]) for i in a if i == "_id"},
        **{i: a[i] for i in a if i != "_id"},
    }


def serializeList(entity) -> list:
    print("serializeList function called")
    return [serializeDict(a) for a in entity]
