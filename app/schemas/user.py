def serializeDict(a) -> dict:
    return {
        **{i: str(a[i]) for i in a if i == "_id"},
        **{i: a[i] for i in a if i != "_id"},
    }


def serializeList(entity) -> list:
    print("serializeList function called")
    return [serializeDict(a) for a in entity]
