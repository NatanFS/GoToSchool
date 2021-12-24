from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser
from cpf_field.models import CPFField

# Create your models here.

CHOICES_TURNO = (("matutino", "matutino"), ("vespertino", "vespertino"), ("noturno", "noturno"))

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
    cpf = CPFField('CPF', default='000.000.000-00')
    is_staff = models.BooleanField("Membro da equipe", default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
  
    def __str__(self):
        return self.email

    objects = UsuarioManager()
    
class Motorista(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome do motorista")
    email = models.CharField(max_length=100, verbose_name="E-mail")
    cpf = CPFField('CPF', default='000.000.000-00')
    turno = models.CharField(choices=CHOICES_TURNO, verbose_name="Turno", max_length=30)