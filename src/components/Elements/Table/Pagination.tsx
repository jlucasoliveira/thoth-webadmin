import { IconButton, Theme, chakra } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import { ReactComponent as LeftIcon } from '@/assets/icons/directions/left.svg';
import { ReactComponent as RightIcon } from '@/assets/icons/directions/right.svg';
import { paginationStyle } from './styles';

type PaginationProps = Omit<ReactPaginateProps, 'pageCount'> & {
  changePage: (page: number) => void;
  pages: number;
  page: number;
};

const MAX_TRAILING_PAGES = 3;

const MyPaginate = chakra(ReactPaginate);

function Pagination(props: PaginationProps) {
  const theme = useTheme<Theme>();

  return (
    <MyPaginate
      {...props}
      css={paginationStyle(theme)}
      pageCount={props.pages}
      pageRangeDisplayed={MAX_TRAILING_PAGES}
      onPageChange={({ selected }) => props.changePage(selected + 1)}
      forcePage={props.page - 1}
      previousLabel={
        <IconButton
          aria-label="Voltar uma página"
          icon={<LeftIcon width="16" height="16" />}
          colorScheme="blue"
          rounded="full"
          w="24px"
          h="24px"
          minW="24px"
        />
      }
      nextLabel={
        <IconButton
          aria-label="Avançar uma página"
          icon={<RightIcon width="16" height="16" />}
          colorScheme="blue"
          rounded="full"
          w="24px"
          h="24px"
          minW="24px"
        />
      }
    />
  );
}

export { Pagination };
