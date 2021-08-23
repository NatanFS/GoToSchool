function TableCarregando() {
    var rows = []
    //Cria objetos "Linha" para preencher a tabela
    for (let i = 0; i < 10; i++) {
        let row = (<LinhaCarregando></LinhaCarregando>)
        rows.push(row);
    }

    return (
        <table class="table table-light table-striped table-hover align-middle">
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