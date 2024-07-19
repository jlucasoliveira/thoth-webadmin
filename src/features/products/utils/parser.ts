import { FormType, VariationForm } from '../components/Forms/validation';
import { Payload } from '../api/createProduct';
import { Payload as ProductVariationPayload } from '../api/variations/createVariation';

export function parseFormTypeToPayload(data: FormType): Payload {
  return {
    brandId: data.brand!.id,
    name: data.name,
  };
}

export function parseFormTypeToVariationPayload(
  data: VariationForm,
  productId?: number
): ProductVariationPayload {
  return {
    ...data,
    iconId: data.iconObject?.id,
    productId: data.productId! || productId!,
    categories: (data.categories ?? []).map((category) => category!.id as number),
  };
}
