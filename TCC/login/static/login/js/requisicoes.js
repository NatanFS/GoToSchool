var data1;
fetch('requisicoes/0')
.then(response => response.json())
.then(response => {
    var response = JSON.parse(response)
    var data = response
    inicializarTabela(data)
})

console.log(data1)

function inicializarTabela(dados){
    ReactDOM.render(<Table data={dados}/>,
        document.querySelector('main'))
}