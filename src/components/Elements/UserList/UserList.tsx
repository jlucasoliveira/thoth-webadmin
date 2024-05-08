import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Actions, generateDefaultActions, Table } from '@/components/Elements';
import { generatePath } from 'react-router-dom';
import { UserRoutesEnum } from '@/features/users';
import { Flex, FlexProps, Input, Text } from '@chakra-ui/react';

interface UserListProps<T> {
  users: T[];
  fixLayout?: boolean;
  isClient?: boolean;
}

export const UserList = <T extends Record<string, any>>({
  users,
  fixLayout,
  isClient,
}: UserListProps<T>) => {
  const [filter, setFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const items = users || [];
  const data = filter
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(filter.toLowerCase()) ||
          i.email.includes(filter.toLowerCase())
      )
    : items;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: 'Cliente',
        accessorKey: 'name',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        header: 'E-mail',
        accessorKey: 'email',
        enableSorting: false,
      },
      { header: 'Telefone', accessorKey: 'phone', enableSorting: false },
      // {
      //   header: 'Status',
      //   enableSorting: false,
      //   accessorFn: (row) => ({ isActive: row.isActive, id: row.id }),
      //   cell: (info) => {
      //     const { isActive, id } = info.getValue() as Record<string, string | boolean>;
      //     return (
      //       <Status<ClientModel>
      //         id={id as string}
      //         value={isActive as boolean}
      //         hook={useClientPartialUpdate}
      //       />
      //     );
      //   },
      // },
      {
        header: 'Ações',
        accessorKey: 'id',
        enableSorting: false,
        cell: (info) => {
          const id = info.getValue() as string;
          return (
            <Actions
              id={id}
              options={generateDefaultActions(
                generatePath(UserRoutesEnum.View, { id }),
                generatePath(UserRoutesEnum.Edit, { id })
              )}
            />
          );
        },
      },
    ],
    []
  );

  const containerStyle = useMemo<FlexProps>(
    () => ({
      bgColor: 'white',
      ml: 50,
      direction: 'column',
      overflowX: 'hidden',
      ...(fixLayout
        ? {
            flexGrow: 1,
            ml: 0,
            p: 5,
            rounded: 8,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'gray.450',
          }
        : {}),
    }),
    [fixLayout]
  );

  return (
    <Flex {...containerStyle}>
      <Text mb={4} size="sm">
        <b>Buscar {isClient ? 'responsável' : 'usuário'}</b>
      </Text>

      <Input
        name="role"
        rounded={10}
        placeholder={`Filtrar ${isClient ? 'responsável' : 'usuário'} por nome, email`}
        isDisabled={false}
        value={filter}
        mb={6}
        onChange={({ target: { value } }) => {
          setFilter(value);
          setCurrentPage(1);
        }}
      />

      <Table
        columns={columns}
        data={currentItems}
        pages={totalPages || 0}
        frontPagination={{
          currentPage,
          setCurrentPage,
          itemsPerPage,
          setItemsPerPage,
          totalPages,
        }}
      />
    </Flex>
  );
};
