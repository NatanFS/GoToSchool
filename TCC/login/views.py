from login.models import User
from login.forms import CadastrarStaffForm
from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
import firebase_admin
from .util import initialize_firebase, recuperarOnibus
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json
from firebase_admin import credentials, firestore
from pyfcm import FCMNotification
from django.views.generic import CreateView
from google.cloud.firestore_v1 import Increment
from django.contrib import messages

credentials_google = {
    "type": "service_account",
    "project_id": "projetointegrador-7141d",
    "private_key_id": "2e6950a3102c5fcf453302f0168a4cee43f67f13",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCk5+cA22QXOMyu\nvaTiS6i6RpTRJAe2OxXuZkjIsHI0Nhm39u7YxW5xbuL/lQ6cdRTEht7rTHTwlALb\n1rRXHWPrYZ8Tr3t18svX6PkyHU3/cOlKiW7d3E9xjk6p461otvZpm9axovduW/PU\nQt+3+wiT8NiKJ85jz2Tng/GwGyNZ18fmewVrxnqvu91y4s7LE0xu9/TtY+37nx6u\nh58o6OBMfml44fbYSh4qWGiyHHpDPZ+cgFDdVQYmZcGodVQtxO48Cg0oyi/sMpkO\nbJXJYhijBxgHMc3kas22p2cYPd679Z12n4mR6z0Cp4MsFqEDBcAC0jH1vLm2h4yc\nlQIb62nhAgMBAAECggEADr85UoOMICKBdWf6uIz9Dgl1Uf2nneWLSMpHXIEg+WfU\nJXY09lgzj/vTW3lUOOwkew23njG0bHZECi5ZasfzUU+l1vAUuZ/ImGqabF+gA8Ww\nayy+qCMFTLml8b3tWkWwZBHeYXzaJTmeZL9FO/H8WqSJbNNx+s2Hb8fGI5JNt0E2\ndxgCEttgy1g7m+AWmMQCkjUPVSldLx22BJKOxzpL6VyZefViSHDSkTrL5SsibXEz\nbdwgrnNTXApesV4vW0uQPhEYR7Zer0XsBBQFwC49dB4UJ2ZOZF5Pt2qqZri6+MRY\n4dG7M6qxylZ/j/jtDnKpSyzdNpgvCaci69zcOii+pQKBgQDoDGrn7JsNDD3TV9ZI\nSbtkN9+kwapCZHH01voD9KBCOO1xyROF5qfiPPZum7Oq2BRULVJYpPOmUA7aWF/C\nBsbVHRVoR3FndRVZYW/CeDHu9evMP7NvZQjprOiD6ofCFvkaFyWDRtayzzTkl+LY\np9/B2DzdWhI5+dOm7kl5jshS/QKBgQC17VPCCS4WD4NIfMwN6PWntiqf2yXtkhec\nux/z/nofhwCRMCgQFxiTLTd4bHr6Int+8+Oc4Y3nZ8Ch+0uEcAIETTADLww3PlYC\nfYm+9tBSdUVOAgbx7uaImBVcWluhYOK2n+lHFjLd6b8K7fG2+gxaUTvNKvbQVan3\nsvTg4hjBtQKBgAQcXDR5m5GSmvHIh5JGRByVZM/dYm/EqcQlns49Ii2qJoKyhjcE\nDAtU+ySge4FWTJ3lI6VQXsSefHTfxeqBBjq2Ri/PvDGSAGvR7xHp4TCTiLbYlgwu\nJQdGuePEXt1QXN9ac56svZbzVsOJ8UnXR35+ny1osBP42ggGBqUxo1jdAoGAHghu\n0lJ3pDatYpMPkKBLpYMiKD+iVETQ1xPhI4N4H6pGwrEje/yEFw/Y321xI8f7gSq8\nAZMOvQvYtiTpA5UGEDW53lyu9JO62TBmQ/s0ytgHN+iHwvrAXf5VUGiuRcbbxnBB\nr3WPsii7XA+J3r4KugI9EBKuqhfqNjT5zgIlOh0CgYEAxso+UrM6d5lzSq9ia7El\nhSfmdUJxEhrf1igansgpmvfYx8cRybdJcWaxb/Ox6O/GP0YLc+Icwk/De1HR8Vjk\nL7ub/wajmX/lRDrGRClczf3wdEjl1PJCR8s6Pzm9pj52PNk10VftEYhyj8kZMRqT\naaLgHJNiag7a8tiv45qPj9w=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-6vsr7@projetointegrador-7141d.iam.gserviceaccount.com",
    "client_id": "108262067636559201753",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6vsr7%40projetointegrador-7141d.iam.gserviceaccount.com"
    }

cred = credentials.Certificate(credentials_google)
firebase_admin.initialize_app(cred)
firebase = initialize_firebase()
dbRealtime = firebase.database()
dbFirestore = firestore.client()
collection = dbFirestore.collection('dados')
doc = collection.document('requisicoesDados')


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
        return render(request, 'login/index.html', {"user": user, "title": "Home"})
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

@login_required
def requisicoes_view(request):
    return render(request, "login/requisicoes.html", {"title": "Responder requisições"})

@csrf_exempt
def getReqData(request):
    #Index indicará a página selecionada
    usuarios = []
    onibus = []
    usuariosIDs = []
    requisicoes = []
    lastkey = ""
    requisicoesDados = doc.get().to_dict()
    
    if(requisicoesDados["numPendentes"] > 0):
        if(request.method == "GET"): 
            dbRequisicoes = dbRealtime.child("dados/requisicoes/lista")\
            .order_by_child("timeinmillis").start_at(1).limit_to_first(10).get().val()
        else: 
            data = json.loads(request.body)
            lastkey = data.get("lastkey", "")
            dbRequisicoes = dbRealtime.child("dados/requisicoes/lista")\
            .order_by_child("timeinmillis").start_at(lastkey).limit_to_first(11).get().val()

        for key in dbRequisicoes:
            req = dbRequisicoes[key]
            requisicoes.append(req)
            usuarioID = req["usuarioID"]
            if(not usuarioID in usuariosIDs):
                usuariosIDs.append(usuarioID)
            bus = recuperarOnibus(req, dbRealtime)
            if(not bus in onibus):
                onibus.append(bus)
        for id in usuariosIDs:
            usuarioDados = dbRealtime.child("dados").child("usuarios").child(id).get().val()
            usuarios.append(usuarioDados)
        lastkey = requisicoes[-1]["timeinmillis"],
    data = {
        "usuarios": usuarios,
        "requisicoes": requisicoes,
        "onibusLista": onibus,
        "lastkey": lastkey,
        "totalReqs": requisicoesDados["numPendentes"]
    }
    print(data)
    dataJSON = json.dumps(data)
    return JsonResponse(dataJSON, safe=False)

@csrf_exempt
def answerReq(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    dataNotification = {}
    reqId = data.get("reqId", "")
    status = data.get("status", "")
    user = data.get("user", "")
    token = user["token"]
    usuarioID = user["idUsuario"]
    
    collection = dbFirestore.collection('dados')
    docUsuarioDados = collection.document(usuarioID)
    
    print("Token: " + token)
    dbRealtime.child(f"dados/requisicoes/lista/{reqId}/statusRequisicao").set(status)
    dbRealtime.child(f"dados/requisicoes/lista/{reqId}/timeinmillis").set(0)
    doc.update({'numPendentes': Increment(-1)})
    altConfirmadas = dbRealtime.child(f"dados/usuarios/{usuarioID}/altConfirmadas").get().val()
    if(status == 1):
        doc.update({'numConfirmadas': Increment(1)})
        docUsuarioDados.update({"altConfirmadas": Increment(1)})
        altDadosUsuario = docUsuarioDados.get().to_dict()
        altConfirmadas = altDadosUsuario["altConfirmadas"]
        message = f"{altConfirmadas} de suas requisições foram confirmadas."
        dataNotification["status"] = 1
        dataNotification["title"] = "Confirmadas"
        reservarVaga(data)
    else:
        doc.update({'numNegadas': Increment(1)})
        docUsuarioDados.update({"altNegadas": Increment(1)})
        altDadosUsuario = docUsuarioDados.get().to_dict()
        altNegadas = altDadosUsuario["altNegadas"]
        message = f"{altNegadas} de suas requisições foram negadas."
        dataNotification["status"] = 0
        dataNotification["title"] = "Negadas"
    
    dataNotification["message"] = message
    dataNotification["title"] = "Requisições"
    enviarNotificacao(token, dataNotification)
    return JsonResponse({"message": "Request aswered successfully."}, status=201)

def enviarNotificacao(token, data):
    push_service = FCMNotification(api_key="AAAAKGgPQHI:APA91bH1DavnWFdUEaBNtFr_Qoxa0t9Cr9MAKoqC0kXvEpRireeMPgg1Q6M5NASp1IaPUsFG4bMpnzPRHn8IDC1Qs2aha57rEBGvC4f4tSaxcG-0x9y9DkyYNi-4jkxNR4ZX5iWNjfbX")
    registration_id = token
    result = push_service.single_device_data_message(registration_id=registration_id, data_message=data)
    print(result)

def reservarVaga(data):
    print('RESERVAR VAGA')
    onibus = data.get("onibus", "")
    user = data.get("user", "")
    reqId = data.get("reqId", "")
    dbRealtime.child(f"dados/requisicoes/lista/{reqId}/vagaReservada").set(True)
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
    dbRealtime.child(f"dados/dias/{onibusData}/turnos/{onibusTurno}/onibusLista/{onibusNome}/listaPassageiros/{nextIndexPassageiro}").set(userId)
    dbRealtime.child(f"dados/dias/{onibusData}/turnos/{onibusTurno}/onibusLista/{onibusNome}/vagasOcupadas").set(nVagasOcupadas)
    
class CadastrarStaff(CreateView):
    model = User
    form_class = CadastrarStaffForm
    template_name = 'login/cadastro-staff.html'
    extra_context = {"title": "Cadastrar administradores."}   
    success_url = "cadastrar-staff"
    def get_success_url(self):
        return reverse("cadastrar-staff")
    def form_valid(self, form):
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password1"])
        user.email = form.cleaned_data["username"]
        user.save()
        messages.success(self.request, "Usuário administrador adicionado com sucesso!")
        return super().form_valid(form)
    
def usuarios_view(request):
    if request.method == "GET":
        return render(request, "login/usuarios.html" , {'title': "Gerenciar usuários"})
    