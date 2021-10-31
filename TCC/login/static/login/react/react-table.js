const useTable = window.ReactTable.useTable
const usePagination = window.ReactTable.usePagination
const useState = React.useState
const useMemo = React.useMemo
const useEffect = React.useEffect
export const Table = () => {
    const columns = useMemo(() => COLUMNS, [])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalUsers, setTotalUsers] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    var isSearching = true
    
    useEffect(() => {
        initTable()
    }, [])

    useEffect(() => {
        if(totalUsers > data.length && data.length > 0){
            const lastKey = data.at(-1)["idUsuario"]
            getNewData(lastKey, data, pageIndex)
        }

        
    }, [data]) 

    const tableInstance = useTable({
        columns,
        data,
        autoResetPage: false
    }, usePagination)

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        gotoPage,
        canNextPage,
        canPreviousPage,
        state,
        pageOptions,
        prepareRow } = tableInstance

    const { pageIndex } = state

    var emptyRowsNumber = 10 - page.length
    var emptyRows = []
    for (var i = 0; i < emptyRowsNumber; i++) {
        emptyRows.push(<tr role="row">
            <td role="cell"> <img class="foto-usuario invisible"></img></td>
            <td role="cell"> </td>
            <td role="cell"> </td>
            <td role="cell"> </td>
            <td role="cell"> </td>
            <td role="cell"> </td>
        </tr>)
    }

     
    const getNewData = async (lastkey, oldData, currentPageIndex) => {
        setLoading(true)
        const res = await fetch("API/usuarios", {method: 'POST', body: JSON.stringify({lastkey: lastkey})})
        const resJSON = await res.json()
        const data = JSON.parse(resJSON)
        const dataArr = Object.values(data.usuarios)
        if(dataArr.length == 0){
            isSearching = true
            return false;
        }
        const totalUsers = data.total
        const newData = oldData.concat(dataArr)
        console.log("SET")
        setTotalUsers(totalUsers)
        setData(newData)
        setLoading(false)
        
    }

    const initTable = async () => {
        setLoading(true)
        const res = await fetch("API/usuarios")
        const resJSON = await res.json()
        const data = JSON.parse(resJSON)
        const dataArr = Object.values(data.usuarios)
        const totalUsers = data.total
        setTotalUsers(totalUsers)
        setData(dataArr)
        setLoading(false)
    }

    function goToUser(row){
        var uid = row.original.idUsuario
        window.location.pathname =(`usuario/${uid}`) 
    }

    function showingUsersNumber() {
        if(canNextPage){
            return (<> {pageIndex*10} </>)
        } else {
            return (<> {totalUsers%10} </>)
        }
    }

    function visibilityButtonNext(){
        if(canNextPage){
            return {"display":"block"}
        } else {
            return {"display":"none"}
        }
    }

    function visibilityButtonPrevious(){
        if(canPreviousPage){
            return {"display":"block"}
        } else {
            return {"display":"none"}
        }
    }

    function cancelSearch(){
        initTable()
        const searchField = document.querySelector("#search-input")
        searchField.value = ""
    }

    async function search(){
        const searchInput = document.querySelector('#search-input')
        const option = document.querySelector('#search-options').value
        const text = searchInput.value
        const res = await fetch("API/usuarios", {method: "POST", body: JSON.stringify({'search': text, 'type': option})})
        const resJSON = await res.json()
        const data = JSON.parse(resJSON)
        if(!data.usuarios){
            return initTable()
        }
        console.log(data)
        const usuariosArr = Object.values(data.usuarios)
        setTotalUsers(data.total)
        setData(usuariosArr)
    }

    return (<>
        <form action="JavaScript:search()">
            <div className="search-container d-flex flex-row align-items-center">
                
                <div className="search col-8">
                    <div className="icon-container">
                        <span className="fas fa-search search" onClick={search}></span>
                    </div>

                    <div className="icon-container">
                        <span className="fas fa-times cancel" onClick={cancelSearch}></span>
                    </div>

                    <div class="form-group">
                        <input id="search-input" type="text" className="form-control"></input>
                    </div>
                </div>
                
                <div class="form-group col-4 search-options"> 
                    <label for="search-options">Pesquisar por:</label>
                    <select id="search-options" name="search-options">
                    <option value="nome">Nome</option>
                    <option value="email">E-mail</option>
                    <option value="cpf">CPF</option>
                    <option value="turno">Turno</option>
                    </select>
                </div>
            </div>
            <div className="d-grid">
                <input type="submit" id="search-button" onClick={search} className="btn btn-primary" value="Pesquisar"></input>
            </div>            
        </form>
        <table {...getTableProps()} class="table table-light table-striped table-hover align-middle">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} >
                        {headerGroup.headers.map((column) => {
                            return <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        })}
                    </tr>
                ))}

            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row)
                    return (<tr {...row.getRowProps()}>
                    
                        {row.cells.map(cell => {
                            if (cell.column.id == "urlFoto") {
                                return <td {...cell.getCellProps()}>
                                    <img src={cell.value} class="foto-usuario" />
                                </td>
                            }
                            if (cell.column.id == "ver") {
                                return <td {...cell.getCellProps()}>
                                    <button class="btn btn-primary btn-ver" onClick={() => goToUser(row)}> Ver </button>
                                </td>
                            }
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>)
                })}

                {emptyRows}

            </tbody>
        </table>
       <div style={{padding: 5 + 'px'}}>
        <button className="btn" onClick={previousPage} style={visibilityButtonPrevious()}>
                <span className="fas fa-arrow-left"  ></span>
            </button>
            Exibindo {showingUsersNumber()} de {totalUsers} Usuários
            <button className="btn" onClick={nextPage} style={visibilityButtonNext()}>
                <span className="fas fa-arrow-right" ></span>
            </button>
       </div>
    </>
)
    
}

ReactDOM.render(<Table />,
    document.querySelector('main'))