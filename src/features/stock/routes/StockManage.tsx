import { useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { useGetBrand } from '@/features/brands/api/getBrand';
import { useGetProduct } from '@/features/products/api/getProduct';
import { useGetProductVariation } from '@/features/products/api/variations/getVariation';
import { useVariationPartialUpdate } from '@/features/products/api/variations/partialUpdateVariation';
import { StockManageForm, FormType } from '../components/StockManageForm';
import { useGetStock } from '../api/getStock';

function StockManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const stock = useGetStock({ variationId: id });
  const variation = useGetProductVariation({ id });
  const product = useGetProduct({ id: variation.data?.productId });
  const brand = useGetBrand({ id: product.data?.brandId });
  const productUpdate = useVariationPartialUpdate();

  async function onSubmit(data: FormType) {
    if (
      id &&
      product.data?.id &&
      data.value !== undefined &&
      variation.data?.price !== data.value
    ) {
      await productUpdate.mutateAsync({
        id: id,
        productId: product.data.id,
        payload: {
          price: data.value,
        },
      });
    }
  }

  return (
    <StockManageForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      fetchingLoading={
        (variation.isFetching && variation.isLoading) ||
        (stock.isFetching && stock.isLoading) ||
        (brand.isFetching && brand.isLoading) ||
        (product.isFetching && product.isLoading)
      }
      data={variation.data}
      stock={stock.data}
      brand={brand.data}
    />
  );
}

export { StockManage };
