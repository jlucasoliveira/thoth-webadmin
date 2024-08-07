import {
  TableContainer,
  Table as ChakraTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Container,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  CellContext,
} from '@tanstack/react-table';
import { Pagination } from './Pagination';
import FrontPagination from './FrontPagination';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { SortIcon } from './SortIcon';

interface FrontPaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

type TableProps<T> = {
  data: T[];
  title?: string;
  columns: ColumnDef<T>[];
  enableRowSelection?: boolean;
  onRowSelectionChange?: (row: T) => void;
  debug?: boolean;
  pages: number;
  frontPagination?: FrontPaginationProps;
  filtersContext?: string;
  forceScroll?: boolean;
};

function Table<T>(props: TableProps<T>) {
  const { query, changePage, handleOrder, sorting } = useFilters<T>({
    context: props.filtersContext,
  });
  const table = useReactTable({
    state: { sorting },
    data: props.data,
    columns: props.columns,
    onSortingChange: handleOrder,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableSortingRemoval: true,
    enableMultiSort: true,
    debugTable: props.debug,
  });

  const renderCell = useCallback((cell: CellContext<T, unknown>) => {
    if (typeof cell.column.columnDef.cell === 'string') return cell.column.columnDef.cell;
    else {
      const renderedCell = cell.column.columnDef.cell?.(cell);
      if (typeof renderedCell === 'string')
        return renderedCell.substring(0, 30) + (renderedCell.length > 30 ? '...' : '');
      return renderedCell;
    }
  }, []);

  return (
    <Flex flexGrow={1} direction="column">
      {props?.title ? (
        <Heading size="sm" mb="1">
          {props.title}
        </Heading>
      ) : null}
      <Container
        borderStyle="solid"
        borderWidth="1px"
        borderColor="gray.450"
        rounded={4}
        flexGrow={1}
        justifyContent="space-between"
        flexDirection="column"
        paddingBottom={5}
        maxWidth="initial"
        overflowX="hidden"
        bgColor="white"
        minH="32"
        display="flex"
        p={0}
        m={0}
      >
        <TableContainer
          justifyContent="space-between"
          flex={1}
          position="relative"
          roundedTop={8}
          flexGrow={1}
          overflowY={props.forceScroll ? undefined : 'hidden'}
          __css={props.forceScroll ? { '-webkit-scrollbar': { display: 'none' } } : undefined}
        >
          <ChakraTable size="sm" variant="striped">
            <Thead
              borderBottomColor="gray.460"
              borderBottomWidth={2}
              bgColor="gray.100"
              position="sticky"
              top="0"
              zIndex={2}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      color="gray.460"
                      fontSize="0.75rem"
                      position="relative"
                      colSpan={header.colSpan}
                      textTransform="capitalize"
                      onClick={
                        !props.frontPagination ? header.column.getToggleSortingHandler() : undefined
                      }
                      cursor={
                        header.column.getCanSort() && !props.frontPagination ? 'pointer' : 'default'
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span style={{ position: 'absolute', right: 5 }}>
                        {header.column.getCanSort() && !props.frontPagination ? (
                          <SortIcon sorted={header.column.getIsSorted()} />
                        ) : null}
                      </span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      color="gray.560"
                      fontSize="0.75rem"
                      css={{ a: { textTransform: 'none' } }}
                    >
                      {flexRender(renderCell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </ChakraTable>
        </TableContainer>
        {props.pages > 1 ? (
          props.frontPagination ? (
            <FrontPagination
              data={props.data}
              itemsPerPage={props.frontPagination.itemsPerPage}
              setItemsPerPage={props.frontPagination.setItemsPerPage}
              currentPage={props.frontPagination.currentPage}
              setCurrentPage={props.frontPagination.setCurrentPage}
              totalPages={props.frontPagination.totalPages}
            />
          ) : (
            <Pagination page={query.pageNumber} pages={props.pages} changePage={changePage} />
          )
        ) : null}
      </Container>
    </Flex>
  );
}

export { Table };
