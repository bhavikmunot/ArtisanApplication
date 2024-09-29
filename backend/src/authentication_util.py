import fastapi
from datetime import datetime, timedelta
import fastapi.security as security
from jose import JWTError, jwt

from . import model
from .fake_db import search_for_user_in_db

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "jwtsecret"


def verify_password(password_from_request: str, password_from_database: str):
    if password_from_request == password_from_database:
        return True
    else:
        return False


async def authenticate_user(email: str, password: str):
    user = search_for_user_in_db(email)

    if not user:
        return False

    if verify_password(password, user.fake_hashed_password):
        return user
    else:
        return False


async def create_token(user: model.User):
    to_encode = user.dict()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


def get_current_user(
        token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = search_for_user_in_db(payload["email"])
    except JWTError:
        raise fastapi.HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return user.id
