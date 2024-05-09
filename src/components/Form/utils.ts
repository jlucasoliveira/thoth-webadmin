import { Gender } from '@/features/products/types';

export function generateStatusOption() {
  return [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];
}

export function generateConfirmationOption() {
  return [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];
}

export function generateGenderOption() {
  return [
    { label: 'Nenhum', value: Gender.None },
    { label: 'Masculino', value: Gender.Male },
    { label: 'Feminino', value: Gender.Female },
  ];
}
