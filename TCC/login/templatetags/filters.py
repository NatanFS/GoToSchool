from django import template

register = template.Library()

def firstAndLast(value):
    arr = value.split()
    return arr[0] + " " + arr[-1]

register.filter('firstAndLast', firstAndLast)