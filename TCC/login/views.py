from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .util import initialize_firebase
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
import pyrebase

firebase = None

# Create your views here.
def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            global firebase
            firebase = initialize_firebase()
            login(request, user)
            print(user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login/login.html", {
                "message": "Nome de usuário ou senha inválido."
            })
    else:
        return render(request, 'login/login.html')


def index(request):
    user = request.user
    if user.is_anonymous:
        return HttpResponseRedirect(reverse("login"))
    else:
        global firebase
        firebase = initialize_firebase()
        return render(request, 'login/index.html', {"user": user})
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

@login_required
def requisicoes_view(request):
    db = firebase.database()
    dbRequisicoes = db.child("dados").child("requisicoes")
    print(dbRequisicoes)
    return render(request, "login/requisicoes.html")

