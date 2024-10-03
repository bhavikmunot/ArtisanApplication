import unittest
from unittest.mock import patch
from jose import jwt, JWTError
import fastapi

from src.model.UserModel import User
from src.util import authentication_util


class TestAuthenticationUtil(unittest.TestCase):

    def setUp(self):
        self.valid_user = User(id=1, email="test@example.com", fake_hashed_password="hashed_password")
        self.valid_password = "hashed_password"
        self.invalid_password = "wrong_password"
        self.jwt_secret = "jwtsecret"
        self.patcher = patch("backend.src.util.authentication_util.search_for_user_in_db")
        self.mock_search_for_user = self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def test_verify_password_success(self):
        result = authentication_util.verify_password(self.valid_password, self.valid_user.fake_hashed_password)
        self.assertTrue(result)

    def test_verify_password_failure(self):
        result = authentication_util.verify_password(self.invalid_password, self.valid_user.fake_hashed_password)
        self.assertFalse(result)

    @patch("..src.util.authentication_util.search_for_user_in_db", return_value=None)
    async def test_authenticate_user_failure(self, mock_search_for_user):
        result = await authentication_util.authenticate_user("invalid_email@example.com", self.valid_password)
        self.assertFalse(result)

    @patch("..src.util.authentication_util.search_for_user_in_db", return_value=User(id=1, email="test@example.com", fake_hashed_password="hashed_password"))
    async def test_authenticate_user_success(self, mock_search_for_user):
        result = await authentication_util.authenticate_user("test@example.com", self.valid_password)
        self.assertEqual(result, self.valid_user)

    async def test_create_token(self):
        token_data = await authentication_util.create_token(self.valid_user)
        token = token_data["access_token"]

        decoded_payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
        self.assertEqual(decoded_payload["email"], self.valid_user.email)
        self.assertIn("exp", decoded_payload)

    @patch("backend.src.util.authentication_util.jwt.decode", side_effect=JWTError)
    def test_get_current_user_invalid_token(self, mock_jwt_decode):
        with self.assertRaises(fastapi.HTTPException) as context:
            authentication_util.get_current_user(token="invalid_token")
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Could not validate credentials")

    @patch("backend.src.util.authentication_util.jwt.decode")
    def test_get_current_user_invalid_user(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {"email": "invalid_email@example.com"}
        self.mock_search_for_user.return_value = None

        with self.assertRaises(fastapi.HTTPException) as context:
            authentication_util.get_current_user(token="valid_token")
        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Invalid Email or Password")


if __name__ == "__main__":
    unittest.main()
