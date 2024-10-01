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
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
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


    """
    Generate an authentication token for a user.

    This endpoint authenticates a user with their credentials
    and returns a token if the credentials are valid.

    - **form_data**: OAuth2 password request form containing `username` and `password`.

    - Returns:
        - A token if authentication is successful.
        - Raises HTTP 401 if the credentials are invalid.
    """

    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await create_token(user)




#In the real-world, there should be a POST API to accept a user message and return a request id for that message
#Another API (GET) to track the progress of message generation for the request-id
#And a final API (GET) to get the message_reply from the bot once the message for the request is generated

#Other approach can be to use websockets. As we want to keep the API Server simple, I am using a single API
#to fetch a response from the bot for a user_message

@app.get("/api/message_reply/{message}")
@limiter.limit("5/minute")
async def process_user_messages(
        user: Annotated[str, fastapi.Depends(get_current_user)],
        message: Annotated[str, fastapi.Path()],
        request: Request
):

    """
    Process user messages and return a reply from the chatbot.

    This endpoint takes a user message and returns a random response
    from a predefined set of static responses.

    - **user**: The authenticated username.
    - **message**: The message sent by the user.

    - Returns:
        - A JSON object containing the `reply` from the chatbot.
    """
    print(f"Received a message: {message} from user: {user}")
    random_number = random.randint(0,1)
    return {"reply":STATIC_RESPONSE[random_number]}


@app.get("/")
async def root():
    """
    Root endpoint for the chatbot service.

    Returns a welcome message.

    - Returns:
        - A JSON object with a welcome message.
    """
    return {"message": "Welcome to Ava, the chatbot"}