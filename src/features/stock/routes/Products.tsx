import { useMemo } from 'react';
import { ListWrapper } from '@/components/Layout';
import { generateDefaultIsActiveFilters } from '@/components/Elements';
import { ProductList } from '../components/ProductList';

function Products() {
  const filters = useMemo(generateDefaultIsActiveFilters, []);

  return (
    <ListWrapper
      title="Estoque"
      searchField="identification"
      filters={filters}
      List={ProductList}
    />
  );
}

export { Products };
