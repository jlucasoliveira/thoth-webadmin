import { useMemo } from 'react';
import { ListWrapper } from '@/components/Layout';
import { generateDefaultIsActiveFilters } from '@/components/Elements';
import { ProductList } from '../components/ProductList';
import { ProductRoutes } from './constants';

function Products() {
  const filters = useMemo(generateDefaultIsActiveFilters, []);

  return (
    <ListWrapper
      title="Produtos"
      filters={filters}
      searchField="name"
      registrationRoute={ProductRoutes.Registration}
      List={ProductList}
    />
  );
}

export { Products };
