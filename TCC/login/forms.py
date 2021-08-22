from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

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