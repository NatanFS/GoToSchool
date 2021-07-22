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
    var pageIndex;
    var totalReqs = props.data.totalReqs
    recuperarUsuarios()
    recuperarRequisicoes()
   
    const [dataState, setData] = React.useState({"usuarios": usuarios,
                                                "requisicoes": requisicoes,
                                                "onibusLista": onibusLista,
                                                "reactRows": rows,
                                                "totalReqs": totalReqs,
                                                "pageIndex": 0,})
    usuarios = dataState.usuarios
    pageIndex = dataState.pageIndex
    onibusLista = dataState.onibusLista
    totalReqs = dataState.totalReqs
    requisicoes = dataState.requisicoes

    var rowIndex = 0
    createRowsViews(requisicoes)
    const [rowsState, setRows] = React.useState(rows)
    rows = rowsState
    if(requisicoes){
        var lastkey = requisicoes.slice(-1)[0]["timeinmillis"]
    }
    //console.log(lastkey)
    if(totalReqs !== 0){
       
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
        console.log("INDEX: " + pageIndex)
        pageSelecionada = pages[pageIndex]
        console.log(pages)
        definirMensagem()
        definirVisibilidadeBtn()
    } else {
        mensagem = `Não há requisições a serem respondidas.`
        definirVisibilidadeBtn()
    }
    
    getNewReqs()

    return (<div className="text-center">
        <TableData rows={pageSelecionada}>
        </TableData>
        <button className="btn" onClick={previousRows} style={btnLeftStyle}>
            <span className="fas fa-arrow-left" ></span>
        </button>
        {mensagem}
        <button className="btn" onClick={nextRows} style={btnRightStyle}>
            <span className="fas fa-arrow-right" ></span>
        </button>
    </div>)

function definirMensagem(){
    var inicio = pageIndex * 10 + 1
    var fim = pageIndex * 10 + pages[pageIndex].length
    mensagem = `Exibindo ${inicio}-${fim} de ${totalReqs} requisicões.`
}

function rowsToPages(){
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
    console.log(rows)
}
function createRowsViews(requisicoes){
    console.log("CREATE ROWS")
    requisicoes.forEach((req) => {
        createRowView(req)
    })
    rowsToPages()
}

function createRowView(req){
    let selectedUser = getUserFromReq(req)
        let selectedOnibus;
        onibusLista.forEach((onibus) => {
            if(onibus.onibusTurnoID == req.onibusID){
                selectedOnibus = onibus
            }
        })
    rowIndex++;
    console.log(rowIndex)
    var row = (<LinhaReq requisicao={req} usuario={selectedUser} onibus={selectedOnibus}
        index={rowIndex} update={update} />)
        console.log(rows)
    rows.push(row)
}

function getUserFromReq(req){
    let selectedUser;
        usuarios.map((user) => {
            if(user.idUsuario == req.usuarioID){
                selectedUser = user;
            }
        })
    return selectedUser
}
function recuperarUsuarios(){
    console.log(dados)
    usuarios = dados.usuarios
}

function recuperarRequisicoes(){
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
        console.log(updatedReqs)
        return {...data, "requisicoes": updatedReqs, "totalReqs": totalReqs}
    })
}


function nextRows() {
    if (pageIndex < pages.length && !pages[pageIndex+1].length > 0) {
        fetch(`requisicoes/${pageIndex}`, {
            method: 'POST',
            body: JSON.stringify(
                {
                  lastkey: lastkey
                }
              )
         
          }).then(response => response.json())
            .then(response => {
                setData(() => {
                    console.log(response)
                    let data = JSON.parse(response)
                    data.requisicoes.shift() //Remove a primeira requisição, que será repetida.                    
                    let nPageIndex = pageIndex + 1
                    let nUsuarios = usuarios.concat(data.usuarios)                 
                    let nRequisicoes = requisicoes.concat(data.requisicoes)
                    let nOnibusLista = onibusLista.concat(data.onibusLista)
                    let nTotalReqs = data.totalReqs
                    console.log(nRequisicoes)
                    console.log(data.requisicoes)
                    let newData = {
                        "usuarios": nUsuarios,
                        "pageIndex": nPageIndex,
                        "requisicoes": nRequisicoes,
                        "onibusLista": nOnibusLista,
                        "totalReqs": nTotalReqs
                    }
                    console.log(newData)
                    return newData
                })
            })
        
    } else {
        setData((data) => {
            let nPageIndex = pageIndex + 1
            return {...data, "pageIndex": nPageIndex}
        })
    }
}

function getNewReqs(){
    //Executar se a próxima página ainda não estiver no cache
    if(pages[pageIndex + 1] && !pages[pageIndex + 1].length > 0 ){
        fetch(`requisicoes/${pageIndex}`, {
            method: 'POST',
            body: JSON.stringify(
                {
                  lastkey: lastkey
                }
              )
         
          }).then(response => response.json())
            .then(response => {
                setData((oldData) => {
                    console.log(response)
                    let data = JSON.parse(response)
                    data.requisicoes.shift() //Remove a primeira requisição, que será repetida.                    
                    let nUsuarios = usuarios.concat(data.usuarios)                 
                    let nRequisicoes = requisicoes.concat(data.requisicoes)
                    let nOnibusLista = onibusLista.concat(data.onibusLista)
                    let nTotalReqs = data.totalReqs
                    console.log(nRequisicoes)
                    console.log(data.requisicoes)
                    let newData = {
                        ...oldData,
                        "usuarios": nUsuarios,
                        "requisicoes": nRequisicoes,
                        "onibusLista": nOnibusLista,
                        "totalReqs": nTotalReqs
                    }
                    console.log(newData)
                    return newData
                })
            })
    }
}

function previousRows() {

    setData((data) => {
        let pageIndex = data.pageIndex
        pageIndex--
        return {...data, "pageIndex": pageIndex}
    })
}


function definirVisibilidadeBtn() {
    if (!pages[pageIndex - 1]) {
        btnLeftStyle = {
            "display": "none"
        }
    }

    if (!pages[pageIndex + 1]) {
        btnRightStyle = {
            "display": "none"
        }
    }
}
}

function LinhaReq(props) {
    const rowAnimation = {
        "animation-name": "hide",
        "animation-duration": "1s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    const style = {
        "animation-name": "hide",
        "animation-duration": "1s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    const btnAnimation = {
        "animation-name": "hide-btn",
        "animation-duration": "0.5s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    function deny() {
        answerReq(-1)
        props.update(props.requisicao.requisicaoID)
    }

    function confirm() {
        answerReq(1)
        props.update(props.requisicao.requisicaoID)
    }

    function answerReq(status){
        fetch('requisicoes/answer', {
            method: 'POST',
            body: JSON.stringify(
              {
                reqId: props.requisicao.requisicaoID,
                user:  props.usuario,
                onibus: props.onibus,
                status: status,
              }
            )
          }).then(response => response.json())
            .then(result => {
              console.log(result)
            })
    }

    return (
        <tr className="requisicao" id={props.index} style={rowAnimation}>
            <th className="align-items-center" scope="row" style={style}>{props.index}</th>
            <td className="align-items-center" style={style}>{props.usuario.nome}</td>
            <td className="align-items-center" style={style}>{props.requisicao.dataViagem}</td>
            <td className="align-items-center" style={style}>{props.requisicao.dataHoraRequisicao}</td>
            <td className="align-items-center" style={style}>
                <input class="button" id="btn-confirm" style={btnAnimation} onClick={confirm} type="image" src="../static/login/img/confirm-button.png" value="" id="button-confirm" />
                <input class="button" id="btn-deny" style={btnAnimation} onClick={deny} type="image" src="../static/login/img/deny-button2.png" value="" id="button-deny" />
            </td>
        </tr>
    )
}

function TableData(props) {
    var rows = props.rows
    console.log(rows)
    return (
        <table class="table table-dark table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Passageiro</th>
                    <th scope="col">Viagem</th>
                    <th scope="col">Data/Hora Solicitação</th>
                    <th scope="colspan2"></th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}