var form = document.getElementById('editar-dados-usuario')
console.log(form)
var elements = form.elements
for(let i = 0; i < elements.length; i++){
    elements[i].disabled = "true"
}
