import { useMemo } from 'react';
import { ListWrapper } from '@/components/Layout';
import { generateDefaultIsActiveFilters } from '@/components/Elements';
import { BrandsList } from '../components/BrandsList';
import { BrandsRoutes } from './constants';

function Brands() {
  const filters = useMemo(generateDefaultIsActiveFilters, []);

  return (
    <ListWrapper
      title="Marcas"
      filters={filters}
      registrationRoute={BrandsRoutes.Registration}
      List={BrandsList}
    />
  );
}

export { Brands };
