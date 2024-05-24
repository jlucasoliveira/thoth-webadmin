import { FormType } from '../components/ProductManageForm';
import { VariationForm } from '../components/Forms/validation';
import { Payload } from '../api/createProduct';
import { Payload as ProductVariationPayload } from '../api/variations/createVariation';

export function parseFormTypeToPayload(data: FormType): Payload {
  return {
    brandId: data.brand.value,
    categoryId: data.category.value,
    gender: data.gender,
    name: data.name,
    volume: data.volume,
    weight: data.weight,
  };
}

export function parseFormTypeToVariationPayload(
  data: VariationForm,
  productId?: string
): ProductVariationPayload {
  return {
    externalCode: data.externalCode,
    price: data.price,
    iconId: data.iconObject?.id,
    barcode: data.barcode,
    variation: data.variation,
    productId: data.productId! || productId!,
  };
}
