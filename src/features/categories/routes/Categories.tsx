import { useMemo } from 'react';
import { ListWrapper } from '@/components/Layout';
import { generateDefaultIsActiveFilters } from '@/components/Elements';
import { CategoriesList } from '../components/CategoriesList';
import { CategoriesRoutes } from './constants';

function Categories() {
  const filters = useMemo(generateDefaultIsActiveFilters, []);

  return (
    <ListWrapper
      title="Categorias"
      filters={filters}
      registrationRoute={CategoriesRoutes.Registration}
      List={CategoriesList}
    />
  );
}

export { Categories };
