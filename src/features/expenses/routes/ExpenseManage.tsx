import { useParams } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { Params } from '@/types/props';
import { extractChangedValues } from '@/utils/helpers';
import type { FormType } from '../components/validation';
import { ExpenseManageForm } from '../components/ExpenseManageForm';
import { parseFormTypeToPayload } from '../utils/parser';
import { useExpensePartialUpdate } from '../api/partialUpdateExpense';
import { useCreateExpense } from '../api/createExpense';
import { useGetExpense } from '../api/getExpense';

function ExpenseManage() {
  const params = useParams<Params>();
  const id = params.id ? +params.id : undefined;
  const { isEdit } = useFilters();
  const creation = useCreateExpense();
  const edit = useExpensePartialUpdate();
  const currentExpense = useGetExpense({ id });

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);
    if (id) {
      const changes = extractChangedValues(currentExpense.data!, payload);
      await edit.mutateAsync({ id, payload: changes });
    } else {
      await creation.mutateAsync(payload);
    }
  }

  return (
    <ExpenseManageForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      data={currentExpense.data}
      loading={creation.isLoading || edit.isLoading}
      fetchingLoading={currentExpense.isLoading && currentExpense.isFetching}
    />
  );
}

export { ExpenseManage };
