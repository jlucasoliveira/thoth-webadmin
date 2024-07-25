import { useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { OrderManageForm } from '../components/OrderManageForm';
import { useGetOrder } from '../api/getOrder';
import { useCreateOrder } from '../api/createOrder';
import { useOrderPartialUpdate } from '../api/partialUpdateOrder';
import { FormType } from '../components/validations';
import { parseFormTypeToPayload } from '../utils/parser';

function OrderManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const currentOrder = useGetOrder({
    id,
    params: { include: { items: { variation: { product: true } }, client: true, seller: true } },
  });
  const creation = useCreateOrder();
  const edit = useOrderPartialUpdate();

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);
    if (id) {
      await edit.mutateAsync({ id, payload: { paid: data.paid, totalPaid: data.totalPaid } });
    } else {
      await creation.mutateAsync(payload);
    }
  }

  return (
    <OrderManageForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      loading={creation.isLoading || edit.isLoading}
      data={currentOrder.data}
      fetchingLoading={currentOrder.isFetching && currentOrder.isLoading}
    />
  );
}

export { OrderManage };
