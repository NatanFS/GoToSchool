from os import replace
from django import template
from django.core import serializers
from django.core.serializers import serialize
from django.db.models.query import QuerySet
import json
from django.template import Library

register = Library()

def getNome(usuario):
    nome = usuario.first_name + usuario.last_name
    return firstAndLast(nome)

def firstAndLast(value):
    arr = value.split()
    return arr[0] + " " + arr[-1]

def first(value):
    arr = value.split()
    return arr[0]

def removeSpace(value):
    nValue = value.replace(" ", "-")
    return nValue

register.filter('getNome', getNome)
register.filter('first', first)
register.filter('firstAndLast', firstAndLast)
register.filter('removeSpace', removeSpace)