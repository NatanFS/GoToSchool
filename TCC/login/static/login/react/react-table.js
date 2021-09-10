const useTable = window.ReactTable.useTable

export const Table = () => {
    const columns = React.useMemo(() => COLUMNS, [])
    const data = React.useMemo(() => MOCK_DATA, [])
    const tableInstance = useTable({
        columns,
        data
    })

    const{getTableProps,
         getTableBodyProps,
         headerGroups,
         rows,
         prepareRow} = tableInstance
        
         console.log(headerGroups)

    return (<table {...getTableProps()} class="table table-light table-striped table-hover align-middle">
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {console.log(headerGroup)}
                    {headerGroup.headers.map((column) => {
                        
                        return <th {...column.getHeaderProps()}>
                        {console.log(column)}
                            {column.render("Header")}
                        </th>
                    })}
                    </tr>
                ))} 
             
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row)
                        return(
                            <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                console.log(row)
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                                
                             </tr>
                    )
                    })}
                    
                </tbody>
            </table>)
}

ReactDOM.render(<Table/>,
    document.querySelector('main'))