//Renderiza tabela de carregamento enquanto não recebe os dados do servidor
ReactDOM.render(<TableCarregando/>,
    document.querySelector('main'))
    
//Faz a requisição dos dados para o servidor
fetch('requisicoes/api')
.then(response => response.json())
.then(response => {
    var response = JSON.parse(response)
    var data = response
    console.log("dados recuperados")
    inicializarTabela(data)
})

//Renderiza a tabela com os dados recebidos
function inicializarTabela(dados){
    ReactDOM.render(<Table data={dados}/>,
        document.querySelector('main'))
}