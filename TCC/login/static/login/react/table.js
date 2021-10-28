function Table(props) {
    var dados = props.data
    var onibusLista = props.data.onibusLista
    var rows = []
    var pages = new Array();
    var usuarios = []
    var requisicoes = []
    var mensagem;
    var btnLeftStyle = {}
    var btnRightStyle = {}
    var pageSelecionada;
    var nextPageLoaded
    var pageIndex;
    var totalReqs = props.data.totalReqs
    recuperarUsuarios()
    recuperarRequisicoes()

    const [dataState, setData] = React.useState({
        "usuarios": usuarios,
        "requisicoes": requisicoes,
        "onibusLista": onibusLista,
        "reactRows": rows,
        "totalReqs": totalReqs,
        "nextPageLoaded": false,
        "pageIndex": 0,
    })
    nextPageLoaded = dataState.nextPageLoaded
    usuarios = dataState.usuarios
    pageIndex = dataState.pageIndex
    onibusLista = dataState.onibusLista
    totalReqs = dataState.totalReqs
    requisicoes = dataState.requisicoes
    var rowIndex = 0
    createRowsViews(requisicoes)
    
    const [rowsState, setRows] = React.useState(rows)
    rows = rowsState

    let init = false
    let showed = false
    firebase.database().ref("dados/requisicoes/lista").limitToLast(1).on('child_added', (snap, prev) => {

        if (init && !showed) {
            console.log("toast")
            Toast.show("Novas requisições foram realizadas. Clique aqui para recarregar a página.")
            showed = true
        }
        init = true
    })

    
    if (totalReqs !== 0) {

        //Provavelmente terei que adicionar o código para retroceder uma página
        //caso não haja mais requisições na última página.
        if (!pages[pageIndex]) {
            pageIndex--;
            setData((state) => {
                return {
                    ...state,
                    "pageIndex": pageIndex
                };
            })
        }
        pageSelecionada = pages[pageIndex]
        definirMensagem()
    } else {
        mensagem = `Não há requisições a serem respondidas.`
    }

    definirVisibilidadeBtn()
    let getReqs = async () => {
        if(requisicoes.length < totalReqs){
            var lastKey = await getLastKey()
            await getNewReqs(lastKey)
        }
        
    }
    React.useEffect(getReqs, [requisicoes])
    var emptyRows = [];
    var nLinhasVazias = 10
    if (pageSelecionada != null) {
        nLinhasVazias = 10 - pageSelecionada.length
        console.log(pageSelecionada.length)
    }
    for (let i = 0; i < nLinhasVazias; i++) {
        emptyRows.push((<LinhaVazia></LinhaVazia>))
    }
    return (
        <> 
        <TableData rows={pageSelecionada} emptyRows={emptyRows}>
        </TableData>
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
        mensagem = `Exibindo ${inicio}-${fim} de ${totalReqs} requisicões.`
    }

    function rowsToPages() {
        var nRequisicoes = totalReqs
        var nPaginas = Math.ceil(nRequisicoes / 10)
        for (let i = 0; i < nPaginas; i++) {
            var rowsPage = [];
            for (let j = i * 10; j < i * 10 + 10; j++) {
                if (requisicoes.length > j) {
                    rowsPage.push(rows[j])
                }
            }
            pages[i] = rowsPage

        }
    }
    function createRowsViews(requisicoes) {
        requisicoes.forEach((req) => {
            createRowView(req)
        })
        rowsToPages()
    }

    function createRowView(req) {
        let selectedUser = getUserFromReq(req)
        let selectedOnibus;
        var row;
        onibusLista.forEach((onibus) => {
            if (onibus.onibusTurnoID == req.onibusID) {
                selectedOnibus = onibus
                row = (<LinhaReq requisicao={req} usuario={selectedUser} onibus={selectedOnibus}
                    index={rowIndex} update={update} />)
            }
        })
        rowIndex++;
        rows.push(row)
    }

    function getUserFromReq(req) {
        let selectedUser;
        usuarios.map((user) => {
            if (user.idUsuario == req.usuarioID) {
                selectedUser = user;
            }
        })
        return selectedUser
    }
    function recuperarUsuarios() {
        usuarios = dados.usuarios
    }

    function recuperarRequisicoes() {
        requisicoes = dados.requisicoes
    }

    function update(reqID) {
        var updatedReqs = []
        setData((data) => {
            let totalReqs = data.totalReqs
            totalReqs--
            for (let i = 0; i < data.requisicoes.length; i++) {
                if (data.requisicoes[i].requisicaoID !== reqID) {
                    updatedReqs.push(data.requisicoes[i])
                }
            }
            return { ...data, "requisicoes": updatedReqs, "totalReqs": totalReqs }
        })
    }


    function nextRows() {

        setData((data) => {
            let nPageIndex = pageIndex + 1
            return { ...data, "pageIndex": nPageIndex, "nextPageLoaded": false }
        })

    }

    function getNewReqs(lastkey) {
        //Executar se os dados da próxima página ainda não estiverem no cache     
        
        return new Promise((resolve, reject) => {
            console.log("RECUPERAR NOVAS REQS")
            fetch(`API/requisicoes`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        lastkey: lastkey
                    }
                )

            }).then(response => response.json())
                .then(response => {
                    nextPageLoaded = true
                    setData((oldData) => {
                        let data = JSON.parse(response)
                        data.requisicoes.shift() //Remove a primeira requisição, que será repetida.                    
                        let nUsuarios = usuarios.concat(data.usuarios)
                        let nRequisicoes = requisicoes.concat(data.requisicoes)
                        let nOnibusLista = onibusLista.concat(data.onibusLista)
                        let nTotalReqs = data.totalReqs
                        let newData = {
                            ...oldData,
                            "usuarios": nUsuarios,
                            "requisicoes": nRequisicoes,
                            "onibusLista": nOnibusLista,
                            "totalReqs": nTotalReqs
                        }
                        return newData
                    })
                    resolve()
                })
        })
    }

    function getLastKey(){
        return new Promise((resolve, reject) => {
            var lastkey = requisicoes.slice(-1)[0]['timeinmillis']
            console.log(lastkey)
            resolve(lastkey)
        })
    }

    function previousRows() {
        setData((data) => {
            let pageIndex = data.pageIndex
            pageIndex--
            return { ...data, "pageIndex": pageIndex }
        })
    }


    function definirVisibilidadeBtn() {
        // Se não há página anterior, esconde o botão. 
        if (!pages[pageIndex - 1]) {
            btnLeftStyle = {
                "display": "none"
            }
        }
        
        // Se não há uma próxima página de requisições, esconde o botão. Caso contrário, mostra. | Se os dados da página atual ainda não tiverem sido atualizados, esconde o botão.
        if (!pages[pageIndex + 1] || pages[pageIndex].length == 0) {
            btnRightStyle = {
                "display": "none"
            }
        }
    }
}

function LinhaReq(props) {
    var onibus = props.onibus
    const [selectedBus, setSelectedBus] = React.useState(props.onibus);
    if (props.onibus != selectedBus) {
        setSelectedBus(props.onibus)
    }
    let initFlag = 0
    firebase.database().ref(`dados/dias/${onibus.data}/turnos/${onibus.turnoPadrao}/onibusLista/${onibus.nome}`).on("value", (snap) => {
        if (initFlag === 1) {
            setSelectedBus(snap.val())
        }
        initFlag = 1;
    })

    return (
        <tr className="requisicao" id={props.index} >
            <td className="align-items-center" scope="row">{props.usuario.nome}</td>
            <td className="align-items-center">{props.requisicao.dataViagem}</td>
            <th className="align-items-center">{props.requisicao.turnoViagem.charAt(0).toUpperCase() + props.requisicao.turnoViagem.slice(1)}</th>
            <td className="align-items-center">{selectedBus.vagasOcupadas}/{selectedBus.vagasTotal}</td>
            <td className="align-items-center">
                <input class="button" id="btn-confirm" onClick={confirm} type="image" src="../static/login/img/confirm-button.png" value="" id="button-confirm" />
                <input class="button" id="btn-deny" onClick={deny} type="image" src="../static/login/img/deny-button2.png" value="" id="button-deny" />
            </td>
        </tr>
    )


    function deny() {
        answerReq(-1)
        props.update(props.requisicao.requisicaoID)
    }

    function confirm() {
        answerReq(1)
        props.update(props.requisicao.requisicaoID)
    }

    function answerReq(status) {
        fetch('requisicoes/answer', {
            method: 'POST',
            body: JSON.stringify(
                {
                    reqId: props.requisicao.requisicaoID,
                    user: props.usuario,
                    onibus: props.onibus,
                    status: status,
                }
            )
        }).then(response => response.json())
    }


}

function TableData(props) {
    var rows = props.rows
    var emptyRows = props.emptyRows
    return (
        <table class="table table-light table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th scope="col">Passageiro</th>
                    <th scope="col">Viagem</th>
                    <th scope="col">Turno</th>
                    <th scope="col">Vagas</th>
                    <th scope="colspan2"></th>
                </tr>
            </thead>
            <tbody>
                {rows}
                {emptyRows}
            </tbody>
        </table>
    )
}

function LinhaVazia() {
    return (
        <tr>
            <th scope="row"></th>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <input class="button" id="btn-confirm" onClick={confirm} type="image" value="" id="button-confirm" />
            </td>
        </tr>
    )
}