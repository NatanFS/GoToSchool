function Table(props) {
    const state = props.requisicoes
    console.log(state)
    var rows = [];
   
    console.log(props.requisicoes)
    props.requisicoes.forEach((req, index) => {
        var row = (<LinhaReq requisicao={req.requisicao} usuario={req.usuario}
        index={index}/> )
            rows.push(row)
    })

    return (

        <table class="table table-dark table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Passageiro</th>
                    <th scope="col">Viagem</th>
                    <th scope="col">Data/Hora</th>
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
    dbRef.child('dados/requisicoes/' + state.id + "/statusRequisicao").set(1)
    function deny(){
        console.log(state.requisicao.requisicaoID)
        dbRef.child('dados/requisicoes/' + state.usuario.idUsuario + "/" + state.requisicao.requisicaoID + "/statusRequisicao").set(-1)
        
    }

    function confirm(){
        console.log(state.id)
        dbRef.child('dados/requisicoes/' + state.usuario.idUsuario + "/" + state.requisicao.requisicaoID + "/statusRequisicao").set(1)
    }
    return (
        <tr>
            <th scope="row">{state.index}</th>
            <td>{state.usuario.nome}</td>
            <td>{state.requisicao.dataViagem}</td>
            <td>{state.requisicao.dataHoraRequisicao}</td>
            <td>
                <input onClick={confirm} type="image" src="../static/login/img/confirm-button.png" value="" width="30" height="30" id="button-confirm"/>
                <input onClick={deny} type="image" src="../static/login/img/deny-button2.png" value="" width="30" height="30" id="button-deny"/>
            </td>
        </tr>
    )



}



