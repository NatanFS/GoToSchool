//Renderiza tabela de carregamento enquanto não recebe os dados do servidor
ReactDOM.render(<TableCarregando/>,
    document.querySelector('main'))
    
//Faz a requisição dos dados para o servidor
fetch('requisicoes/0')
.then(response => response.json())
.then(response => {
    var response = JSON.parse(response)
    var data = response
    inicializarTabela(data)
})

//Renderiza a tabela com os dados recebidos
function inicializarTabela(dados){
    ReactDOM.render(<Table data={dados}/>,
        document.querySelector('main'))
}