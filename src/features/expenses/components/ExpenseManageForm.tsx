import { useEffect, useMemo } from 'react';
import { Path, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, Form, Input, SearchableSelect } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { ManageWrapper, SubHeader } from '@/components/Layout';
import { DeleteButton } from '@/components/Helpers';
import { FormProps } from '@/types/props';
import { useBrands } from '@/features/brands/api/getBrands';
import { useBankAccounts } from '@/features/bankAccounts/api/getAccounts';
import { ExpenseModel } from '../types';
import { useDeleteExpense } from '../api/deleteExpense';
import { type FormType, defaultValues, schema } from './validation';

function ExpenseManageForm(props: FormProps<FormType, ExpenseModel, { id: number }>) {
  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const title = useMemo(() => {
    const currentTitle = 'despesa';
    if (props.isEdit) return `Editar ${currentTitle}`;
    if (!props.id) return `Novo ${currentTitle}`;
    return currentTitle;
  }, [props]);

  const isFormEdit = useMemo(() => {
    if (props.loading) return false;
    return props.id ? props.isEdit : true;
  }, [props.id, props.isEdit, props.loading]);

  async function onSubmit(data: FormType) {
    props.onSubmit(data);
  }

  useEffect(() => {
    if (props.data) {
      Object.entries(props.data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) setValue(key as Path<FormType>, value as any);
      });
    }
  }, [props.data, setValue]);

  return (
    <ManageWrapper>
      <SubHeader
        {...props}
        title={title}
        DeleteButton={() => <DeleteButton id={props.id!} useMutation={useDeleteExpense} />}
        onClick={handleSubmit(onSubmit)}
      />
      <Form loading={props.fetchingLoading}>
        <FieldsContainer title="Dados da despesa">
          <SearchableSelect
            isRequired
            control={control}
            name="brand"
            label="Marca"
            useFetch={useBrands}
            getOptionLabel={(brand) => brand.name}
            defaultOptionValue={props.data?.brandId}
            handleSetValue={(brand) => setValue('brand', brand)}
            isDisabled={!isFormEdit}
          />
          <SearchableSelect
            isRequired
            control={control}
            name="account"
            label="Conta bancária"
            useFetch={useBankAccounts}
            getOptionLabel={(account) => account.name}
            defaultOptionValue={props.data?.bankAccountId}
            handleSetValue={(bankAccount) => setValue('account', bankAccount)}
            isDisabled={!isFormEdit}
          />
          <Input isRequired control={control} name="value" label="Valor" isDisabled={!isFormEdit} />
          <Input
            isRequired
            control={control}
            name="installments"
            label="Parcelas"
            isDisabled={!isFormEdit}
          />
          <Checkbox
            isRequired
            control={control}
            name="isPaid"
            label="Foi Pago"
            isDisabled={!isFormEdit}
          />
        </FieldsContainer>
      </Form>
    </ManageWrapper>
  );
}

export { ExpenseManageForm };
