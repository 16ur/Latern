from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from ninja import Router, Schema

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


@router.post("/register", response=UserOut)
def register(request, payload: RegisterIn):
    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )
    return user


@router.post("/login")
def login_user(request, payload: LoginIn):
    user = authenticate(
        request,
        username=payload.username,
        password=payload.password,
    )

    if user is None:
        return {"success": False, "error": "Invalid credentials"}

    login(request, user)
    return {"success": True}


@router.post("/logout")
def logout_user(request):
    logout(request)
    return {"success": True}


@router.get("/me", response=UserOut)
def me(request):
    if not request.user.is_authenticated:
        return 401, {"detail": "Authentication required"}

    return request.user
