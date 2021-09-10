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
            const res = await fetch("https://jsonplaceholder.typicode.com/posts")
            const data = await res.json()
            setData(MOCK_DATA)
            setLoading(false)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await fetch("https://jsonplaceholder.typicode.com/posts")
            const data = await res.json()
            setData(MOCK_DATA)
            setLoading(false)
        }

        fetchData()
    }, [currentPage])


    const tableInstance = useTable({
        columns,
        data
    })

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow } = tableInstance

    console.log(headerGroups)
 
    return (<table {...getTableProps()} class="table table-light table-striped table-hover align-middle">
        <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
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
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                </tr>)
            })}

        </tbody>
    </table>)
}

ReactDOM.render(<Table />,
    document.querySelector('main'))