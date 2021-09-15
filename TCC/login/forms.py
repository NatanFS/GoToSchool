from logging import PlaceHolder
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.forms import widgets
from .models import User
from datetime import date
from datetime import datetime
CHOICES_TURNO = (("matutino", "matutino"), ("vespertino", "vespertino"), ("noturno", "noturno"))
CHOICES_STATUS = (("0", "Desabilitado"), ("1", "Habilitado"))
    
class CadastrarStaffForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder':('Nome de usuário'), 'class':('form-control')})
        self.fields['first_name'].widget.attrs.update({'placeholder':('Nome'), 'class':('form-control')})
        self.fields['last_name'].widget.attrs.update({'placeholder':('Sobrenome'), 'class':('form-control')})
        self.fields['password1'].widget.attrs.update({'placeholder':('Senha'), 'class':('form-control')})        
        self.fields['password2'].widget.attrs.update({'placeholder':('Confirme a senha'), 'class':('form-control')})
        
    class Meta:
        model = User
        fields = ['username','first_name', 'last_name']

class DadosUsuarioForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do passageiro")
    email = forms.CharField(max_length=100, label="E-mail")
    cpf = forms.CharField(max_length=14, min_length=14, label="CPF")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    status = forms.ChoiceField(choices=CHOICES_STATUS, label="Status")
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['email'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['cpf'].widget.attrs.update({ 'class':('form-control mask-cpf'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-select')})        
        self.fields['status'].widget.attrs.update({'class':('form-select')})

class MotoristaForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do passageiro")
    email = forms.CharField(max_length=100, label="E-mail")
    cpf = forms.CharField(max_length=14, min_length=14, label="CPF")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    status = forms.ChoiceField(choices=CHOICES_STATUS, label="Status")
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['email'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-select')}) 
        self.fields['cpf'].widget.attrs.update({ 'class':('form-control mask-cpf'), })    
        self.fields['status'].widget.attrs.update({'class':('form-select')})
    

class NovidadeForm(forms.Form):
    conteudo = forms.CharField(max_length=100, label="Conteúdo")
    título = forms.CharField(max_length=100, label="Título")
    timeInMilis = forms.TimeField( )
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['conteudo'].widget.attrs.update({'class':('form-control')})
        self.fields['titulo'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['timeInMilis'].widget.attrs.update({ 'class':('hidden'), })    

class OnibusForm(forms.Form):
    nome = forms.CharField(max_length=100, label="Nome do ônibus")
    placa = forms.CharField(max_length=8, min_length=8, label="Placa")
    horarioIdaSaida = forms.CharField(max_length=100, label="Horário de saída da ida")
    horarioIdaChegada = forms.CharField(max_length=100, label="Horário de chegada da ida")
    horarioVoltaSaida = forms.CharField(max_length=100, label="Horário de saída do retorno")
    horarioVoltaChegada = forms.CharField(max_length=100, label="Horário de chegada do retorno")
    turno = forms.ChoiceField(choices=CHOICES_TURNO, label="Turno")
    capacidade = forms.IntegerField(max_value=150)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'class':('form-control')})
        self.fields['placa'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['horarioIdaSaida'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['horarioIdaChegada'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['horarioVoltaSaida'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['horarioVoltaChegada'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['turno'].widget.attrs.update({ 'class':('form-control'), })
        self.fields['capacidade'].widget.attrs.update({ 'class':('form-control'), })  
        

class AvisoForm(forms.Form):
    texto = forms.CharField(widget=forms.Textarea)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['texto'].widget.attrs.update({ 'class':('form-control '), })
        
        