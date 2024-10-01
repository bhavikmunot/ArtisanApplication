from . import model

# Constant list denoting items in a db
FAKE_DATABASE_ITEMS = [
    model.User('1', 'person@gmail.com', 'hashed_password'),
]

# In a real-world usecase this method should be part of a DAO class and a DI framework-(singleton object through
# dependency injection) db_instance-(such as AWS boto3) should be used to communicate with the db.
def search_for_user_in_db(email_id: str):
    for user in FAKE_DATABASE_ITEMS:
        if user.email == email_id:
            return user
    return None
