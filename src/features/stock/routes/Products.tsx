import { ListWrapper } from '@/components/Layout';
import { Option } from '@/components/Elements';
import { ProductVariationModel } from '@/features/products/types';
import { Filter } from '@/types/pagination';
import { ProductList } from '../components/ProductList';

const filters: Option<ProductVariationModel>[] = [
  {
    key: 'stock.quantity',
    label: 'Estoque',
    operator: 'gte',
    type: 'radio',
    defaultValue: '0:number' as const,
    values: [
      { label: 'Apenas com estoque', value: '1:number' },
      { label: 'Todos os produtos', value: '0:number' },
    ],
  },
];

const searchBuilder = (term: string): Filter<ProductVariationModel> => [
  { variation: { ilike: term } },
  { externalCode: { ilike: term } },
  { product: { name: { ilike: term } } },
];

function Products() {
  return (
    <ListWrapper
      title="Estoque"
      filters={filters}
      searchBuilder={searchBuilder}
      List={ProductList}
    />
  );
}

export { Products };
