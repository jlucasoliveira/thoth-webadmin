import { InferType, object, string } from 'yup';

export const schema = object().shape({
  id: string(),
  name: string().required('Campo obrigatório'),
  email: string().email('Informe um e-mail válido').optional(),
  phoneNumber: string().optional(),
});

export type FormType = InferType<typeof schema>;

export const defaultValues: FormType = {
  name: '',
};
