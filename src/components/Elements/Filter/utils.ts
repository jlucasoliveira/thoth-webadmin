import { Option } from './Filter';

export function generateDefaultIsActiveFilters(): Option<{ isActive: boolean | null }>[] {
  return [
    {
      key: 'isActive',
      label: 'Status',
      operator: 'eq',
      type: 'radio',
      values: [
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' },
        { label: 'Todos', value: 'all' },
      ],
    },
  ];
}
