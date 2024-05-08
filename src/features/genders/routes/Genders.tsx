import { useMemo } from 'react';
import { ListWrapper } from '@/components/Layout';
import { generateDefaultIsActiveFilters } from '@/components/Elements';
import { GendersList } from '../components/GendersList';
import { GendersRoutes } from './constants';

function Genders() {
  const filters = useMemo(generateDefaultIsActiveFilters, []);

  return (
    <ListWrapper
      title="Gêneros"
      filters={filters}
      registrationRoute={GendersRoutes.Registration}
      List={GendersList}
    />
  );
}

export { Genders };
