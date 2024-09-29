class User:
    def __init__(self, id, email, fake_hashed_password):
        self.id = id
        self.email = email
        self.fake_hashed_password = fake_hashed_password

    def __repr__(self):
        return f"Fruit(name='{self.id}', color='{self.email}')"

    def dict(self):
        return {
            "id": self.id,
            "email": self.email
        }
