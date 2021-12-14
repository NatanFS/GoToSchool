from django import template
from django.core import serializers
from django.core.serializers import serialize
from django.db.models.query import QuerySet
import json
from django.template import Library

register = Library()

def firstAndLast(value):
    arr = value.split()
    return arr[0] + " " + arr[-1]

register.filter('firstAndLast', firstAndLast)