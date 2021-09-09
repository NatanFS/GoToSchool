//Renderiza tabela de carregamento enquanto não recebe os dados do servidor
ReactDOM.render(<TableCarregando/>,
    document.querySelector('main'))

recuperarUsuarios()

function recuperarUsuarios(){
    
}

function inicializarTabela(dados){
    ReactDOM.render(<Table data={dados}/>,
        document.querySelector('main'))
}