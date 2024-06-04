import { StockKind } from '../types';

export function translateStockKind(kind: StockKind): string {
  if (kind === StockKind.Entry) return 'Entrada';
  if (kind === StockKind.Removal) return 'Remoção';
  return 'Perda';
}
