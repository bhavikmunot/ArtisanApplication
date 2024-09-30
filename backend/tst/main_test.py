import unittest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient

from ..src import main, authentication_util, model

class TestAPIMethods(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        self.valid_username = "person@gmail.com"
        self.valid_password = "hashed_password"
        self.invalid_username = "invaliduser"
        self.invalid_password = "invalidpassword"
        self.valid_token = "valid_token"
        self.invalid_token = "invalid_token"
        self.message = "Hello!"
        self.message_id = "12345"


        authentication_util.authenticate_user = AsyncMock(
            side_effect=lambda username, password: model.User(
                id=1,
                email="test@example.com",
                fake_hashed_password="hashed_password"
            ) if username == self.valid_username and password == self.valid_password else None
        )

    def test_generate_token_success(self):
        response = self.client.post(
            "/api/token",
            data={"username": self.valid_username, "password": self.valid_password}
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())


    def test_generate_token_invalid_credentials(self):
        response = self.client.post("/api/token", data={"username": self.invalid_username, "password": self.invalid_password})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "Invalid Credentials")

    def test_process_user_messages_success(self):
        main.app.dependency_overrides[authentication_util.get_current_user] = lambda: self.valid_username

        global STATIC_RESPONSE
        STATIC_RESPONSE = ["Response 1", "Response 2"]

        response = self.client.get(f"/api/message_reply/{self.message}", headers={"Authorization": f"Bearer {self.valid_username}"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("reply", response.json())


    def test_process_user_messages_unauthenticated(self):
        response = self.client.get(f"/api/message_reply/{self.message}")
        print(response.json())  # Debug the actual response content
        self.assertEqual(response.status_code, 401)
        self.assertIn("detail", response.json())
        self.assertEqual(response.json()["detail"], "Not authenticated")


    def tearDown(self):
        main.app.dependency_overrides = {}

if __name__ == "__main__":
    unittest.main()
