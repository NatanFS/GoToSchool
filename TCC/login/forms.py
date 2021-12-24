from logging import PlaceHolder
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.forms import widgets
from datetime import date
from datetime import datetime

from login.models import Usuario
CHOICES_TURNO = (("matutino", "matutino"), ("vespertino", "vespertino"), ("noturno", "noturno"))
CHOICES_STATUS = ((-1, "Desabilitado"), (1, "Habilitado"), (0, "Aguardando resposta"))
    
class CadastrarStaffForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({ 'class':('form-control')})
        self.fields['first_name'].widget.attrs.update({ 'class':('form-control')})
        self.fields['last_name'].widget.attrs.update({ 'class':('form-control')})
        self.fields['password1'].widget.attrs.update({ 'class':('form-control')})        
        self.fields['password2'].widget.attrs.update({ 'class':('form-control')})
        
    class Meta:
        model = Usuario
        fields = ['username','first_name', 'last_name']

class DadosUsuarioForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do passageiro")
    email = forms.CharField(max_length=100, label="E-mail")
    cpf = forms.CharField(max_length=14, min_length=14, label="CPF")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    status = forms.ChoiceField(choices=CHOICES_STATUS, label="Status")
    tipo = forms.CharField(max_length=100, label="Tipo", required=False)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['email'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['tipo'].widget.attrs.update({ 'class':('form-control'), 'readonly': True })
        self.fields['cpf'].widget.attrs.update({ 'class':('form-control mask-cpf'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-select')})        
        self.fields['status'].widget.attrs.update({'class':('form-select')})

class MotoristaForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do motorista")
    email = forms.CharField(max_length=100, label="E-mail")
    cpf = forms.CharField(max_length=14, min_length=14, label="CPF")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    senha1 = forms.CharField(widget=forms.PasswordInput)
    senha2 = forms.CharField(widget=forms.PasswordInput)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['senha1'].widget.attrs.update({'class':('form-control')})
        self.fields['senha2'].widget.attrs.update({'class':('form-control')})
        self.fields['senha1'].label = "Senha:"
        self.fields['senha2'].label = "Confirmar senha:"
        self.fields['email'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-select')}) 
        self.fields['cpf'].widget.attrs.update({ 'class':('form-control mask-cpf'), })  

class NovidadeForm(forms.Form):
    titulo = forms.CharField(max_length=100, label="Título")
    conteudo = forms.CharField(max_length=2000, label="Conteúdo", widget=widgets.Textarea)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['conteudo'].widget.attrs.update({'class':('form-control')})
        self.fields['titulo'].widget.attrs.update({ 'class':('form-control'), })   

class OnibusForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do ônibus")
    placa = forms.CharField(max_length=8, min_length=8, label="Placa")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    capacidade = forms.IntegerField(max_value=150)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['placa'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['capacidade'].widget.attrs.update({ 'class':('form-control'), })  
        

class AvisoForm(forms.Form):
    texto = forms.CharField(widget=forms.Textarea, label="", help_text="")
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['texto'].widget.attrs.update({ 'class':('form-control '), 'rows': (4), 'placeholder': "Adicione um aviso" })
        
        