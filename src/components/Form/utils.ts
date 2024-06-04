import { Gender } from '@/features/products/types';
import { StockKind } from '@/features/stock/types';
import { translateStockKind } from '@/features/stock/utils/kind';

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
  return Object.values(StockKind).map((value) => ({ value, label: translateStockKind(value) }));
}
