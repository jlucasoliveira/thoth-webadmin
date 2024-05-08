import { SortDirection } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

type SortIconProps = {
  sorted: false | SortDirection;
};

function SortIcon({ sorted }: SortIconProps) {
  if (sorted === 'asc') return <ArrowUpIcon />;
  if (sorted === 'desc') return <ArrowDownIcon />;
  return <ArrowUpDownIcon />;
}

export { SortIcon };
