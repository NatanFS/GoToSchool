const useTable = window.ReactTable.useTable
const useState = React.useState
const useMemo = React.useMemo
const useEffect = React.useEffect
export const Table = () => {
    const columns = useMemo(() => COLUMNS, [])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await fetch("API/usuarios")
            const resJSON = await res.json()
            const data = JSON.parse(resJSON)
            const dataArr = Object.values(data)
            setData(dataArr)
            setLoading(false)
        }

        fetchData()
    }, [])

    const tableInstance = useTable({
        columns,
        data
    })

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow } = tableInstance

    var emptyRowsNumber = 10 - rows.length
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

    function goToUser(row){
        var uid = row.original.idUsuario
        window.location.pathname =(`usuario/${uid}`) 
    }

    return (<>
        <table {...getTableProps()} class="table table-light table-striped table-hover align-middle">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} >
                        {console.log(headerGroup)}
                        {headerGroup.headers.map((column) => {
                            return <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        })}
                    </tr>
                ))}

            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (<tr {...row.getRowProps()}>
                    
                        {row.cells.map(cell => {
                            console.log(row)
                            if (cell.column.id == "urlFoto") {
                                return <td {...cell.getCellProps()}>
                                    <img src={cell.value} class="foto-usuario" />
                                </td>
                            }
                            if (cell.column.id == "ver") {
                                return <td {...cell.getCellProps()}>
                                    <button onClick={() => goToUser(row)}> Ver </button>
                                </td>
                            }
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>)
                })}

                {emptyRows}

            </tbody>
        </table>
        <button className="btn" >
            <span className="fas fa-arrow-left" ></span>
        </button>
        Usuários
        <button className="btn" >
            <span className="fas fa-arrow-right" ></span>
        </button>
    </>
)
    
}

ReactDOM.render(<Table />,
    document.querySelector('main'))