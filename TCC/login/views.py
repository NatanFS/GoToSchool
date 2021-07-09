from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .util import initialize_firebase, recuperarOnibus
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
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
    #Index indicará a página selecionada
    db = firebase.database()
    dbRequisicoes = db.child("dados").child("requisicoes").get().val()
    
    # Falha ao tentar filtrar dados do firebase. 
    # dbRequisicoes = db.child("dados").child("requisicoes")\
    # .order_by_child("usuarioID").equal_to("bmF0YW5AaG90bWFpbC5jb20=").get().val()
    # Retorna permissão negada, embora o usuário esteja autenticado. No aplicativo, o mesmo código em java funciona perfeitamente. 
    usuarios = []
    onibus = []
    usuariosIDs = []
    requisicoes = []
    
    for key in dbRequisicoes:
        req = dbRequisicoes[key]
        requisicoes.append(req)
        usuarioID = req["usuarioID"]
        if(not usuarioID in usuariosIDs):
            usuariosIDs.append(usuarioID)
        bus = recuperarOnibus(req, db)
        if(not bus in onibus):
            onibus.append(bus)
    for id in usuariosIDs:
        usuarioDados = db.child("dados").child("usuarios").child(id).get().val()
        usuarios.append(usuarioDados)
        
    data = {
        "usuarios": usuarios,
        "requisicoes": requisicoes,
        "onibusLista": onibus
    }
    print(data)
    dataJSON = json.dumps(data)
    return JsonResponse(dataJSON, safe=False)

@csrf_exempt
def answerReq(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    reqId = data.get("reqId", "")
    userId = data.get("userId", "")
    status = data.get("status", "")
    db = firebase.database()
    db.child(f"dados/requisicoes/{userId}/{reqId}/statusRequisicao").set(status)
    return JsonResponse({"message": "Request aswered successfully."}, status=201)