function RequisicoesPage(props) {
    return (<div>
        <Table props={props}></Table>
    </div>)
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

function LinhaReq(props) {

    var dbRef = firebase.database().ref();
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
        dbRef.child('dados/requisicoes/' + props.usuario.idUsuario + "/" + props.requisicao.requisicaoID + "/statusRequisicao").set(-1)
        props.update(props.index)
    }

    function confirm() {
        dbRef.child('dados/requisicoes/' + props.usuario.idUsuario + "/" + props.requisicao.requisicaoID + "/statusRequisicao").set(1)
        props.update(props.index)
    }

    return (
        <tr className="requisicao" id={props.index} style={rowAnimation}>
            <th className="align-items-center" scope="row" style={style}>{props.index + 1}</th>
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

function Table(props) {


    var rows = new Array();
    var pages = new Array();
    var dados = props.props.requisicoesUsuarios;
    var mensagem;
    dados.forEach((req, index) => {
        var row = (<LinhaReq requisicao={req.requisicao} usuario={req.usuario}
            index={index} update={update} />)
        rows.push(row)
    })

    const [state, setState] = React.useState({
        pageIndex: 0,
        inicio: inicio,
        rows: rows,
        fim: fim,
    })

    if(state.rows.length !== 0){
        var nRequisicoes = state.rows.length
        var nPaginas = Math.ceil(nRequisicoes / 10)
    
        for (let i = 0; i < nPaginas; i++) {
            var rowsPage = [];
            for (let j = i * 10; j < i * 10 + 10; j++) {
                if (state.rows.length > j) {
                    rowsPage.push(state.rows[j])
                }
            }
            pages[i] = rowsPage
        }
    
    
        var pageSelecionada;
        var btnLeftStyle = {}
        var btnRightStyle = {}
        var pageIndex = state.pageIndex;
        console.log("Page index: " + state.pageIndex)
        if (!pages[pageIndex]) {
            pageIndex--;
            setState((state) => {
                return {
                    ...state,
                    pageIndex: pageIndex
                }
            })
        }
        var inicio = pageIndex * 10 + 1
        var fim;
        if (pages[pageIndex + 1]) {
            fim = pageIndex * 10 + 10
        } else {
            fim = pageIndex * 10 + pages[pageIndex].length
        }
    
        
        pageSelecionada = pages[pageIndex]
        console.log(pages)
        mensagem = `Exibindo ${inicio}-${fim} de ${state.rows.length} requisicões.`
        definirVisibilidadeBtn()
    } else {
        mensagem = `Não há requisições a serem respondidas.`
        definirVisibilidadeBtn()
    }
    

    function update(index) {
        var updatedRows = []
        console.log(updatedRows)
        setState(function (prevState) {
            var rows = prevState.rows
            console.log("pageIndex: " + prevState.pageIndex)
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].props.index !== index) {
                    updatedRows.push(rows[i])
                } else {
                    console.log(rows[i])
                }
            }
            console.log(updatedRows)
            return {
                ...prevState,
                rows: updatedRows
            }
        })
    }


    function nextRows() {
        if (pageIndex < pages.length) {
            setState((state) => {
                pageIndex = state.pageIndex + 1;
                return {
                    ...state,
                    pageIndex: pageIndex,
                }
            })
        }
    }

    function previousRows() {
        if (pageIndex > 0) {
            etState((state) => {
                pageIndex = state.pageIndex - 1;
                return {
                    ...state,
                    pageIndex: pageIndex,
                }
            })
        }
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
}


function TableCarregando() {
    var rows = []
    for (let i = 0; i < 10; i++) {
        let row = (<LinhaCarregando></LinhaCarregando>)
        rows.push(row);
    }

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

        </table>)
}

function LinhaCarregando() {
    return (
        <tr>
            <th scope="row">Carregando...</th>
            <td>Carregando...</td>
            <td>Carregando...</td>
            <td>Carregando...</td>
            <td>
                <input type="image" src="../static/login/img/confirm-button.png" value="" width="30" height="30" id="button-confirm" />
                <input type="image" src="../static/login/img/deny-button2.png" value="" width="30" height="30" id="button-deny" />
            </td>
        </tr>
    )
}