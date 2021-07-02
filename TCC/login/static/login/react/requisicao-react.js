function RequisicoesPage(props) {
    var rows = new Array();
    var pages = new Array();
    var dados = props.requisicoesUsuarios;
    var nRequisicoes = dados.length
    var nPaginas = Math.ceil(nRequisicoes / 10)
    dados.forEach((req, index) => {
        var row = (<LinhaReq requisicao={req.requisicao} usuario={req.usuario}
            index={index+1} />)
        rows.push(row)
    })

    for (let i = 0; i < nPaginas; i++) {
        var rowsPage = [];
        for (let j = i * 10; j < i * 10 + 10; j++) {
            if (rows.length > j) {
                rowsPage.push(rows[j])
            }
        }
        pages[i] = rowsPage
    }

    console.log(pages[1])
    return (<div>
        <Table pages={pages} total={rows.length}></Table>
    </div>)
}

function TableData(props) {
    var rows = props.rows
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

    const [state, setState] = React.useState(props)
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
        let row = document.getElementById(state.index);
        var button = row.getElementsByClassName("button")
        button[0].style.animationPlayState = "running"
        button[1].style.animationPlayState = "running"

        for (let i = 0; i < row.childNodes.length; i++) {
            row.childNodes[i].style.animationPlayState = "running"
        }

        row.childNodes[0].addEventListener('animationend', () => {
            row.remove()
        })

        dbRef.child('dados/requisicoes/' + state.usuario.idUsuario + "/" + state.requisicao.requisicaoID + "/statusRequisicao").set(-1)

    }

    function confirm() {
        let row = document.getElementById(state.index);
        var button = row.getElementsByClassName("button")
        button[0].style.animationPlayState = "running"
        button[1].style.animationPlayState = "running"

        for (let i = 0; i < row.childNodes.length; i++) {
            row.childNodes[i].style.animationPlayState = "running"
        }

        row.childNodes[0].addEventListener('animationend', () => {
            row.remove()
        })
        dbRef.child('dados/requisicoes/' + state.usuario.idUsuario + "/" + state.requisicao.requisicaoID + "/statusRequisicao").set(1)
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

function Table(props) {
    console.log("table chamada")
    var pages = props.pages
    var pageSelecionada;
    var btnLeftStyle = {}
    var btnRightStyle = {}

    const [state, setState] = React.useState({
        pageIndex: 0,
        inicio: inicio,
        fim: fim,
    })

    var pageIndex = state.pageIndex;
    var inicio = pages[pageIndex][0].props.index;
    var fim = pages[pageIndex][pages[pageIndex].length-1].props.index;
    pageIndex = state.pageIndex;
    pageSelecionada = pages[pageIndex]
    definirVisibilidadeBtn()



    function nextRows() {
        if (pageIndex < pages.length) {
            pageIndex = state.pageIndex + 1;

            setState({
                ...state,
                pageIndex: pageIndex,
            })
        }
    }

    function previousRows() {
        if (pageIndex > 0) {
            pageIndex = state.pageIndex - 1;

            setState({
                ...state,
                pageIndex: pageIndex,
            })
        }
    }


    function definirVisibilidadeBtn() {
        if (!pages[pageIndex - 1]) {
            btnLeftStyle = {
                "display": "none"
            }
        }

        if(!pages[pageIndex + 1]){
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
        Exibindo {inicio}-{fim} de {props.total} requisicões.
        <button className="btn" onClick={nextRows} style={btnRightStyle}>
            <span className="fas fa-arrow-right" ></span>
        </button>
    </div>)
}

