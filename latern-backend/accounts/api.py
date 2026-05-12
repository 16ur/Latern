from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from ninja import Router, Schema

from latern_back.schemas import ErrorOut
from .schemas import AuthSuccessOut

router = Router()


class RegisterIn(Schema):
    username: str
    password: str
    email: str = ""


class LoginIn(Schema):
    username: str
    password: str


class UserOut(Schema):
    id: int
    username: str
    email: str


@router.post("/register", response={201: UserOut, 400: ErrorOut})
def register(request, payload: RegisterIn):
    if User.objects.filter(username=payload.username).exists():
        return 400, {"detail": "Username already taken"}

    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )

    return 201, user


@router.post("/login", response={200: AuthSuccessOut, 401: ErrorOut})
def login_user(request, payload: LoginIn):
    user = authenticate(
        request,
        username=payload.username,
        password=payload.password,
    )

    if user is None:
        return 401, {"detail": "Invalid credentials"}

    login(request, user)
    return {"success": True}


@router.post("/logout")
def logout_user(request):
    logout(request)
    return {"success": True}


@router.get("/me", response={200: UserOut, 401: ErrorOut})
def me(request):
    if not request.user.is_authenticated:
        return 401, {"detail": "Authentication required"}

    return {
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
    }
