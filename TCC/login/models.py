from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser
from cpf_field.models import CPFField

# Create your models here.
class UsuarioManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email é obrigatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser precisa ter is_superuser=True')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser precisa ter is_staff=True')
        return self._create_user(email, password, **extra_fields)


class Usuario(AbstractUser):
      
    first_name = models.CharField(verbose_name=('Nome'), max_length=100, blank=False,
                                  help_text=('Nome é um campo obrigatorio'))
    last_name = models.CharField(verbose_name=('Sobrenome'), max_length=100, blank=False,
                                 help_text=('Sobrenome é obrigatorio'))
    email = models.EmailField('E-mail', unique=True)

    estado_civil = models.CharField(verbose_name='Estado Civil', max_length=25, null=False, default='Indefinido')
    profissao = models.CharField(verbose_name='Profissão', max_length=50, null=True, default='')
    genero = models.CharField(verbose_name='Gênero', max_length=25, null=True, default='')
    nacionalidade = models.CharField(verbose_name='Nacionalidade', max_length=50, null=True, default='Brasileira')
    cpf = CPFField('cpf', default='000.000.000-00')
    # telefone
    endereco = models.CharField(verbose_name='Endereço', max_length=200, null=True, default='')

    is_staff = models.BooleanField("Membro da equipe", default=False)
    is_confirmed = models.BooleanField("Usuário confirmado", default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
  
    def __str__(self):
        return self.email

    objects = UsuarioManager()