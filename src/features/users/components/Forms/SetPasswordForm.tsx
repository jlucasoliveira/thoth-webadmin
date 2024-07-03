import { Control } from 'react-hook-form';
import { object, string, InferType } from 'yup';
import { Input } from '@/components/Form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';

// eslint-disable-next-line react-refresh/only-export-components
export const schema = object().shape({
  password: string().required('Campo obrigatório'),
});

export type SetPasswordFormType = InferType<typeof schema>;

type InternalControl = Control<SetPasswordFormType, any>;

type SetPasswordFormProps<T extends SetPasswordFormType> = {
  control: Control<T, any>;
};

function SetPasswordForm<T extends SetPasswordFormType>({ control }: SetPasswordFormProps<T>) {
  return (
    <FieldsContainer title="Senha">
      <Input
        name="password"
        control={control as InternalControl}
        label="Senha"
        type="password"
        required
      />
    </FieldsContainer>
  );
}

export { SetPasswordForm };
