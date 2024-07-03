import { Control } from 'react-hook-form';
import * as yup from 'yup';
import { phoneMask } from '@/utils/format';
import { Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';

// eslint-disable-next-line react-refresh/only-export-components
export const schema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().required('Campo obrigatório'),
  username: yup.string().optional(),
  phoneNumber: yup
    .string()
    .required('Campo obrigatório')
    .transform((value) => value),
});

export type UserDataFormType = yup.InferType<typeof schema>;

type InternalControl = Control<UserDataFormType, any>;

type UserDataFormProps<T extends UserDataFormType> = {
  control: Control<T, any>;
  isEdit?: boolean;
};

export function UserDataForm<T extends UserDataFormType>({
  control,
  isEdit,
}: UserDataFormProps<T>) {
  return (
    <FieldsContainer title="Dados do usuário" templateColumn={1}>
      <FieldsContainer templateColumn={3}>
        <Input
          isDisabled={!isEdit}
          control={control as InternalControl}
          name="name"
          label="Nome"
          required
        />
        <Input
          isDisabled={!isEdit}
          control={control as InternalControl}
          name="username"
          label="Nome de Usuário"
          required
        />
        <Input
          isDisabled={!isEdit}
          control={control as InternalControl}
          name="phoneNumber"
          label="Telefone"
          formatter={phoneMask}
          maxLength={16}
          required
        />
      </FieldsContainer>
    </FieldsContainer>
  );
}
