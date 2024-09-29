import random
from typing import Annotated

import fastapi as _fastapi
from .static_chatbot_responses import STATIC_RESPONSE


app = _fastapi.FastAPI()


@app.get("/api/message_reply/{message}")
async def process_user_messages(
        message: Annotated[str, _fastapi.Path()]
):
    print(f"Received a message: {message}")
    random_number = random.randint(0,1)
    return {"reply":STATIC_RESPONSE[random_number]}