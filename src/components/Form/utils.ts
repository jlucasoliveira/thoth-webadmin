import { Gender } from '@/features/products/types';
import { StockKind } from '@/features/stock/types';

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

export function generateStockKindOption() {
  return [
    { label: 'Entrada', value: StockKind.Entry },
    { label: 'Remoção', value: StockKind.Removal },
    { label: 'Perca', value: StockKind.Lose },
  ];
}
