from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from pyrebase.pyrebase import initialize_app
from .util import initialize_firebase
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
import json


firebase = initialize_firebase()
# Create your views here.
def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
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
        return render(request, 'login/index.html', {"user": user})
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

@login_required
def requisicoes_view(request):
    return render(request, "login/requisicoes.html")

def getReqData(request, index):
    db = firebase.database()
    dbRequisicoes = db.child("dados").child("requisicoes").get()
    #Dados dos usuários = dados pessoais e requisições
    #Dados finais = dados dos usuários + os ônibus requisitados
    usersData = []
    busReqs = []
    contador = 0
    inicio = index*10
    fim = inicio + 10
    for user in dbRequisicoes.each():
        if(contador < fim):
                #Recuperar usuários
                data = db.child("dados").child("usuarios").child(user.key()).get().val()
                userData = {"userData": data}
                userReqs = []
                
                print(userData)
                for key in user.val():
                    if(contador < fim):
                        if(contador >= inicio):
                            contador += 1
                            #Recuperar requisicoes do usuário
                            req = user.val()[key]
                            userReqs.append(req)
                            print(req["dataViagem"])
                            #Recuperar dados do ônibus da requisição
                            bus = db.child("dados").child("dias").child(req["dataViagem"]) \
                            .child("turnos").child(req["turnoViagem"]) \
                            .child("onibusLista").child(req["onibusNome"]).get().val()
                            if(not bus in busReqs):
                                busReqs.append(bus)
                        else:
                            contador += 1
                    print(contador)
                userData["requisicoes"] = userReqs
                usersData.append(userData)
            
    print("nReq" + str(len(userReqs)))
    data = {
        "usersData": usersData,
        "onibusLista": busReqs
    }
    print(type(data))
    dataJSON = json.dumps(data)
    return JsonResponse(dataJSON, safe=False)