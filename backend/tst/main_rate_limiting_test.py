import unittest
from fastapi.testclient import TestClient

from ..src import main, authentication_util

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


    def test_process_user_messages_rate_limit(self):

        main.app.dependency_overrides[authentication_util.get_current_user] = lambda: self.valid_username
        for _ in range(5):
            response = self.client.get(f"/api/message_reply/{self.message}", headers={"Authorization": f"Bearer {self.valid_token}"})
            self.assertEqual(response.status_code, 200)

        response = self.client.get(f"/api/message_reply/{self.message}", headers={"Authorization": f"Bearer {self.valid_token}"})
        self.assertEqual(response.status_code, 429)
        self.assertIn("5 per 1 minute", response.text.lower())

    def tearDown(self):
        # Reset overrides after tests
        main.app.dependency_overrides = {}

if __name__ == "__main__":
    unittest.main()



