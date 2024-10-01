# Backend API Server

# Execute (On Windows)

Navigate to the backend folder and execute the following
to download the python dependencies
```
cd backend
python3 -m venv venv #create your virtual env

```

Go to the venv folder and activate the source
```commandline
cd venv
.\Scripts\activate

```

install the following dependencies
```commandline
pip3 install fastapi[standard] pyjwt uvicorn
pip3 install slowapi python-jose pytest pytest-asyncio

```

run the following command to run the API server from the backend folder
```commandline
 uvicorn src.main:app --reload
```

You may have to allow access to the APIs for a specific port. Please refactor the Middleware in main.py
```commandline
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
