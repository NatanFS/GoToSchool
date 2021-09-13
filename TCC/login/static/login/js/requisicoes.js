//Renderiza tabela de carregamento enquanto não recebe os dados do servidor
ReactDOM.render(<TableCarregando/>,
    document.querySelector('main'))

 recuperarPrimeirasRequisicoes()   
    
//Faz a requisição dos dados para o servidor
function recuperarPrimeirasRequisicoes(){
    fetch('API/requisicoes')
    .then(response => response.json())
    .then(response => {
        var response = JSON.parse(response)
        var data = response
        console.log("dados recuperados")
        inicializarTabela(data)
    }).catch((err) => {{
        console.log(err)
        // Caso dê erro, tenta novamente. 
        recuperarPrimeirasRequisicoes()
    }})
}

//Renderiza a tabela com os dados recebidos
function inicializarTabela(dados){
    ReactDOM.render(<Table data={dados}/>,
        document.querySelector('main'))
}