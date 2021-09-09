function TableContainer(props){
    var btnLeftStyle = {}
    var btnRightStyle = {}

    return (
        <> 
        <Table rows={pageSelecionada} emptyRows={emptyRows}>
        </Table>
        <div className="table-footer">
        <button className="btn" onClick={previousRows} style={btnLeftStyle}>
            <span className="fas fa-arrow-left" ></span>
        </button>
        {mensagem}
        <button className="btn" onClick={nextRows} style={btnRightStyle}>
            <span className="fas fa-arrow-right" ></span>
        </button>
        </div>
        </>
    )

    function definirMensagem() {
        var inicio = pageIndex * 10 + 1
        var fim = pageIndex * 10 + pageSelecionada.length
        mensagem = `Exibindo ${inicio}-${fim} de ${total} requisicões.`
    }

    function definirVisibilidadeBtn() {
        // Se não há página anterior, esconde o botão. 
        if (!pages[pageIndex - 1]) {
            btnLeftStyle = {
                "display": "none"
            }
        }
        
        // Se não há uma próxima página, esconde o botão. Caso contrário, mostra. | Se os dados da página atual ainda não tiverem sido atualizados, esconde o botão.
        if (!pages[pageIndex + 1] || pages[pageIndex].length == 0) {
            btnRightStyle = {
                "display": "none"
            }
        }
    }
}

function Table(props){
    var rows = props.rows
    var emptyRows = props.emptyRows
    return (
        <table class="table table-light table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th scope="colspan2"></th>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">E-mail</th>
                </tr>
            </thead>
            <tbody>
                {rows}
                {emptyRows}
            </tbody>
        </table>
    )
}

function Row(props){

}