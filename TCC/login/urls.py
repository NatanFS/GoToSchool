from login.forms import CadastrarStaffForm
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name=("login")),
    path('logout', views.logout_view, name=("logout")),
    path('usuarios', views.usuarios_view, name=("usuarios")),
    path('avisos', views.avisos_view, name=("avisos")),
    path('avisos/remover/<str:idAviso>', views.removerAviso, name=("remover-aviso")),
    path('avisos/comentar/<str:idAviso>', views.comentarAviso, name=("comentar-aviso")),
    path('novidades', views.novidades_view, name=("novidades")),
    path('onibus', views.onibus_view, name=("onibus")),
    path('onibus/remover', views.removerOnibus, name=("remover-onibus")),
    path('ouvidoria', views.ouvidoria_view, name=("ouvidoria")),
    path('motoristas', views.motoristas_view, name=("motoristas")),
    path('API/usuarios', views.get_usuarios, name=("getUsuarios")),
    path('usuario/<str:uid>', views.usuario_view, name=("usuario")),
    path("cadastro-staff", views.CadastrarStaff.as_view(), name=("cadastrar-staff")),
    path('requisicoes', views.requisicoes_view, name=('requisicoes')),
    path('API/requisicoes', views.getReqData, name=('reqData')),
    path('API/comentarios/<str:idAviso>', views.getComentarios, name=('getComentarios')),
    path('requisicoes/answer', views.answerReq, name=("answerReq")),
]