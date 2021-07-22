from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .util import initialize_firebase, recuperarOnibus
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json


firebase = initialize_firebase()
db = firebase.database()

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

@csrf_exempt
def getReqData(request, index):
    #Index indicará a página selecionada
    usuarios = []
    onibus = []
    usuariosIDs = []
    requisicoes = []
    totalReqs = db.child("dados/requisicoes/dados/numPendentes").get().val()
    
    # Falha ao tentar filtrar dados do firebase.
    if(request.method == "GET"): 
        dbRequisicoes = db.child("dados/requisicoes/lista")\
        .order_by_child("timeinmillis").start_at(1).limit_to_first(10).get().val()
    else: 
        data = json.loads(request.body)
        lastkey = data.get("lastkey", "")
        dbRequisicoes = db.child("dados/requisicoes/lista")\
        .order_by_child("timeinmillis").start_at(lastkey).limit_to_first(11).get().val()
        
    # Retorna permissão negada, embora o usuário esteja autenticado. No aplicativo, o mesmo código em java funciona perfeitamente. 
    
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
        "onibusLista": onibus,
        "lastkey": requisicoes[-1]["timeinmillis"],
        "totalReqs": totalReqs
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
    status = data.get("status", "")
    db.child(f"dados/requisicoes/lista/{reqId}/statusRequisicao").set(status)
    db.child(f"dados/requisicoes/lista/{reqId}/timeinmillis").set(0)
    numPendentes = db.child("dados/requisicoes/dados/numPendentes").get().val()
    db.child("dados/requisicoes/dados/numPendentes").set(numPendentes - 1)
    if(status == 1):
        numConfirmadas = db.child("dados/requisicoes/dados/numConfirmadas").get().val()
        db.child("dados/requisicoes/dados/numConfirmadas").set(numConfirmadas + 1)
        reservarVaga(data)
    else:
        numNegadas = db.child("dados/requisicoes/dados/numNegadas").get().val()
        db.child("dados/requisicoes/dados/numNegadas").set(numNegadas + 1)
    return JsonResponse({"message": "Request aswered successfully."}, status=201)

def reservarVaga(data):
    print('RESERVAR VAGA')
    onibus = data.get("onibus", "")
    user = data.get("user", "")
    reqId = data.get("reqId", "")
    db.child(f"dados/requisicoes/lista/{reqId}/vagaReservada").set(True)
    print(onibus)
    try:
        nextIndexPassageiro = len(onibus["listaPassageiros"])
    except:
        nextIndexPassageiro = 0
    print(nextIndexPassageiro)
    onibusData = onibus["data"]
    onibusTurno = onibus["turnoPadrao"]
    onibusNome = onibus["nome"]
    userId = user["idUsuario"]
    nVagasOcupadas = nextIndexPassageiro + 1
    db.child(f"dados/dias/{onibusData}/turnos/{onibusTurno}/onibusLista/{onibusNome}/listaPassageiros/{nextIndexPassageiro}").set(userId)
    db.child(f"dados/dias/{onibusData}/turnos/{onibusTurno}/onibusLista/{onibusNome}/vagasOcupadas").set(nVagasOcupadas)
    
    