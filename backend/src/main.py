import random
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware

import fastapi as fastapi
import fastapi.security as security
from fastapi import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from .static_chatbot_responses import STATIC_RESPONSE
from .authentication_util import get_current_user, authenticate_user, create_token

limiter = Limiter(key_func=get_remote_address)

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)


@app.post("/api/token")
async def generate_token(
        form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(),
):
    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await create_token(user)


@app.get("/api/message_reply/{message}")
@limiter.limit("5/minute")
async def process_user_messages(
        user: Annotated[str, fastapi.Depends(get_current_user)],
        message: Annotated[str, fastapi.Path()],
        request: Request
):
    print(f"Received a message: {message} from user: {user}")
    random_number = random.randint(0,1)
    return {"reply":STATIC_RESPONSE[random_number]}


@app.get("/")
async def root():
    return {"message": "Welcome to Ava, the chatbot"}