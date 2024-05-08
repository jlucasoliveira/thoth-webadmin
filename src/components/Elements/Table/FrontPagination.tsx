import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

interface FrontPaginationProps<T> {
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  data: T[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

function FrontPagination<T>({
  currentPage,
  setCurrentPage,
  totalPages,
  setItemsPerPage,
  itemsPerPage,
}: FrontPaginationProps<T>) {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Flex alignItems="center" justifyContent="center" gap="3" padding={2}>
      <Flex alignItems="center" justifyContent="center" gap="1">
        <span>Mostrar</span>

        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            handlePageChange(1);
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </Flex>

      <span>Página</span>

      <IconButton
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Voltar uma página"
        icon={<ArrowLeftIcon width="3" height="3" />}
        colorScheme="blue"
        rounded="full"
        w="24px"
        h="24px"
        minW="24px"
      />

      <span>{currentPage}</span>

      <IconButton
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        aria-label="Avançar uma página"
        icon={<ArrowRightIcon width="3" height="3" />}
        colorScheme="blue"
        rounded="full"
        w="24px"
        h="24px"
        minW="24px"
      />

      <span>de {totalPages}</span>
    </Flex>
  );
}

export default FrontPagination;
