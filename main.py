from fastapi import FastAPI, HTTPException, Depends, status, APIRouter, Query
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import json
import jwt
import uvicorn
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt

with open('database.json', 'r') as file:
    data = json.load(file)
    
auth = APIRouter(tags=["auth"],)
menu = APIRouter(tags=["menu"],)
user = APIRouter(tags=["user"],)

recommendation_router=APIRouter(tags=["recommendation"],)
app = FastAPI()

@app.get("/")
async def read_root():
    return "Welcome to Your Personalized Menu Recommendation!"

class User(BaseModel):
    id_user: int
    nama_user: str
    umur_user: int
    target: str

class Recommendation(BaseModel):
    id_user: int
    id_menu: int
    date: str

class Menu(BaseModel):
    id_menu: int
    nama_menu: str
    kalori: int
    target: str

class signin_user:
    def __init__(self, id, username, pass_hash):
        self.id = id
        self.username = username
        self.pass_hash = pass_hash

    def verify_password(self, password):
        return bcrypt.verify(password, self.pass_hash)

def write_data(data):
    with open("database.json", "w") as write_file:
        json.dump(data, write_file, indent=4)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
recommendation = FastAPI()
JWT_SECRET = 'myjwtsecret'
ALGORITHM = 'HS256'

def get_user_by_username(username):
    for desain_user in data['signin_user']:
        if desain_user['username'] == username:
            return desain_user
    return None

def authenticate_user(username: str, password: str):
    user_data = get_user_by_username(username)
    if not user_data:
        return None

    user = signin_user(id=user_data['id'], username=user_data['username'], pass_hash=user_data['pass_hash'])

    if not user.verify_password(password):
        return None

    return user


@auth.post('/token')
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Invalid username or password'
        )

    token = jwt.encode({'id': user.id, 'username': user.username}, JWT_SECRET, algorithm=ALGORITHM)

    return {'access_token': token, 'token_type': 'bearer'}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user = get_user_by_username(payload.get('username'))
        return signin_user(id=user['id'], username=user['username'], pass_hash=user['pass_hash'])
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Invalid username or password'
        )

@auth.post('/signin_user')
async def create_user(username: str, password: str):
    last_user_id = data['signin_user'][-1]['id'] if data['signin_user'] else 0
    user_id = last_user_id + 1
    user = jsonable_encoder(signin_user(id=user_id, username=username, pass_hash=bcrypt.hash(password)))
    data['signin_user'].append(user)
    write_data(data)
    return {'message': 'User created successfully'}

@auth.get('/signin_user/me')
async def get_user(user: signin_user = Depends(get_current_user)):
    return {'id': user.id, 'username': user.username}

@menu.get("/get_menu")
def get_menu(user: signin_user = Depends(get_current_user)):
    return data["menu"]


@user.get("/get_user")
def get_user(user: signin_user = Depends(get_current_user)):
    return data["user"]


@menu.put("/update_menu")
async def update_menu(id_menu: int, nama_menu: str, kalori: int, target: str, user: signin_user = Depends(get_current_user)):
    for menu in data["menu"]:
        if menu["id_menu"] == id_menu:
            menu["nama_menu"] = nama_menu
            menu["kalori"] = kalori
            menu["target"] = target
            with open('database.json', 'w') as outfile:
                json.dump(data, outfile, indent=4)
            return {"message": "Menu updated successfully"}
    return {"error": "Menu not found"}


@menu.delete("/delete_menu")
async def delete_menu(id_menu: int, user: signin_user = Depends(get_current_user)):
    for menu in data["menu"]:
        if menu["id_menu"] == id_menu:
            data["menu"].remove(menu)
            with open('database.json', 'w') as outfile:
                json.dump(data, outfile, indent=4)
            return {"message": "Menu deleted successfully"}
    return {"error": "Menu not found"}


@menu.post("/add_menu")
async def add_menu(id_menu: int, nama_menu: str, kalori: int, user: signin_user = Depends(get_current_user)):
    menu_id = {menu["id_menu"] for menu in data["menu"]}
    if id_menu in menu_id:
        raise HTTPException(status_code=400, detail="ID already exists")
    menu_baru = {"id_menu": id_menu, "nama_menu": nama_menu, "kalori": kalori}
    data["menu"].append(menu_baru)
    with open('database.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)
    return {"message": "Menu berhasil ditambahkan"}


@user.post("/add_user")
async def add_user(id_user: int, nama_user: str, jenis_kelamin: str, umur_user: int, user: signin_user = Depends(get_current_user)):
    user_id = {user["id_user"] for user in data["user"]}
    if id_user in user_id:
        raise HTTPException(status_code=400, detail="ID already exists")
    new_user = {"id_user": id_user, "nama_user": nama_user, "jenis_kelamin": jenis_kelamin, "umur_user": umur_user}
    data["user"].append(new_user)
    with open('database.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)
    return {"message": "User berhasil ditambahkan"}

# Mendapatkan rekomendasi menu berdasarkan target kalori pengguna
@recommendation_router.get("/get_recommendation")
async def get_recommendation(id_user: int, current_user: signin_user = Depends(get_current_user)):
    # Find user details
    user_details = next((u for u in data['user'] if u['id_user'] == id_user), None)

    if user_details is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Get target kalori user
    target_calories = user_details.get('target_kalori', None)

    if not target_calories:
        raise HTTPException(status_code=400, detail="User's target calories not specified")

    # Convert target calories to an integer
    target_calories = int(target_calories)

    # Filter meals based on target calories
    recommended_meals = [meal for meal in data["menu"] if meal['kalori'] <= target_calories]

    return {"user": user_details, "recommended_meals": recommended_meals}

# Mendapatkan rekomendasi menu berdasarkan standar umur dan jenis kelamin
@recommendation_router.get("/get_standard_recommendation")
async def get_standard_recommendation(id_user: int, current_user: signin_user = Depends(get_current_user)):
    # Find user details
    user = next((u for u in data['user'] if u['id_user'] == id_user), None)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Recommendation logic berdasarkan jenis kelamin dan usia
    gender = user['jenis_kelamin'].lower()
    age = user['umur_user']

    # Rekomendasi menu dengan kalori <=300 untuk perempuan dibawah 35 tahun dan <= 500 untuk laki-laki dibawah 35 tahun
    if gender == 'perempuan' and age < 35:
        recommended_meals = [meal for meal in data["menu"] if meal['kalori'] <= 300]
    elif gender == 'laki-laki' and age < 35:
        recommended_meals = [meal for meal in data["menu"] if meal['kalori'] <= 500]
    else:
        # Default recommendation for other cases
        recommended_meals = data["menu"]

    return {"user": user, "recommended_meals": recommended_meals}


app.include_router(auth)
app.include_router(menu)
app.include_router(user)
app.include_router(recommendation_router)

if __name__	=="__main__":	
    uvicorn.run("main:app",	host="localhost",port=8000, reload=True)