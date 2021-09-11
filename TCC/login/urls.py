from login.forms import CadastrarStaffForm
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name=("login")),
    path('logout', views.logout_view, name=("logout")),
    path('usuarios', views.usuarios_view, name=("usuarios")),
    path('API/usuarios', views.get_usuarios, name=("getUsuarios")),
    path('usuario/<str:uid>', views.usuario_view, name=("usuario")),
    path('usuario/editar>', views.editar_usuario, name=("editar-usuario")),
    path("cadastro-staff", views.CadastrarStaff.as_view(), name=("cadastrar-staff")),
    path('requisicoes', views.requisicoes_view, name=('requisicoes')),
    path('requisicoes/api', views.getReqData, name=('reqData')),
    path('requisicoes/answer', views.answerReq, name=("answerReq")),
]