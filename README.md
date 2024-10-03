# ArtisanApplication
A simple chat bot application.

Clone the package and please follow the instructions mentioned in the backend and frontend package README.md to run the application.
The http api port for the API in react app as well as the middleware port for the backend API are hardcoded, please update them accordingly.

To keep the application simple, I have add a single correct username and password authentication.
Please use below credentails to login/authenticate:

### username: person@gmail.com
### password: hashed_password


Adding some comments here incase, the comments in the code are missed.
I work in a team which is always on fire as we handle the responsibility to make Amazon compliant with various EU/US policies
If I had more time and peace at work, I would have also made the following changes:

1. Most of the string literals should be constants in the code.
2. There should be some common methods in "CommonUtil" class such as to display error in the chatbox and the authenticationModal
3. I could have divided the code into more classes to have smaller classes
4. I could have added some linting rules where a code should not cross "x" characters per line, proper syntax positioning in the code, etc
5. I have been able to add tests to the backend w/f, with almost 80-90% coverage for main classes, but couldn't add them to the frontend. There are many branches in the frontend code to test
6. I haven't been able to use DI for some objects in the backend API, such as for db_dao object, etc
7. For the backend, I should have used api_router, but as I haven't used FastAPI at a larger scale, I didn't invest more time there. I have used Akka for DistributedSystems/API

