import fastapi
from datetime import datetime, timedelta
import fastapi.security as security
from jose import JWTError, jwt

from . import model
from .fake_db import search_for_user_in_db

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")

# TODO: Secret key used for signing and encoding JWT tokens. It should passed as an environment variable
JWT_SECRET = "jwtsecret"


def verify_password(password_from_request: str, password_from_database: str):

    """
    Compare the provided password with the stored password.

    Parameters:
    - password_from_request (str): The password submitted by the user.
    - password_from_database (str): The stored password (hashed) from the database.

    Returns:
    - bool: True if the passwords match, False otherwise.
    """
    if password_from_request == password_from_database:
        return True
    else:
        return False


async def authenticate_user(email: str, password: str):

    """
    Authenticate the user by checking the email and password.

    Parameters:
    - email (str): The user's email address.
    - password (str): The password provided by the user.

    Returns:
    - model.User: The authenticated user object if successful.
    - bool: False if authentication fails.
    """

    user = search_for_user_in_db(email)

    if not user:
        return False

    if verify_password(password, user.fake_hashed_password):
        return user
    else:
        return False


async def create_token(user: model.User):

    """
    Generate a JWT token for the authenticated user.

    Parameters:
    - user (model.User): The user for whom the token is created.

    Returns:
    - dict: A dictionary containing the access token and token type.
    """
    to_encode = user.dict()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


def get_current_user(
        token: str = fastapi.Depends(oauth2schema),
):

    """
    Retrieve the currently authenticated user based on the JWT token.

    Parameters:
    - token (str): The JWT token from the request.

    Returns:
    - str: The user ID of the authenticated user.

    Raises:
    - fastapi.HTTPException: If the token is invalid or the user is not found.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = search_for_user_in_db(payload["email"])
        if user is None:
            raise fastapi.HTTPException(
                status_code=401,
                detail="Invalid Email or Password"
            )
    except JWTError:
        raise fastapi.HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return user.id

