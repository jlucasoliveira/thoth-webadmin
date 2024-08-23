import { Filter } from '@/types/pagination';
import { ListWrapper } from '@/components/Layout';
import { ProductList } from '../components/ProductList';
import { ProductModel } from '../types';
import { ProductRoutes } from './constants';

const searchBuilder = (ilike: string): Filter<ProductModel> => [
  { name: { ilike } },
  { variations: { variation: { ilike } } },
  { variations: { externalCode: { ilike } } },
];

function Products() {
  return (
    <ListWrapper
      title="Produtos"
      searchBuilder={searchBuilder}
      registrationRoute={ProductRoutes.Registration}
      List={ProductList}
    />
  );
}

export { Products };
