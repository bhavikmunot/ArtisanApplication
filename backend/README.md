# Backend API Server

# Execute

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
```

run the following command to run the API server
```commandline
 uvicorn src.main:app --reload
```
