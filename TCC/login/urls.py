from login.forms import CadastrarStaffForm
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name=("login")),
    path('logout', views.logout_view, name=("logout")),
    path("cadastro-staff", views.CadastrarStaff.as_view(), name=("cadastrar-staff")),
    path('requisicoes', views.requisicoes_view, name=('requisicoes')),
    path('requisicoes/api', views.getReqData, name=('reqData')),
    path('requisicoes/answer', views.answerReq, name=("answerReq")),
]