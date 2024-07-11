import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { StockModel, StockEntryModel } from '@/features/stock/types';
import { BaseEntity } from '@/types/common';

export type Params = {
  variationId: string;
  payload: Omit<StockEntryModel, keyof BaseEntity | 'user'> & { newPrice?: number };
};

async function inventoryEntry({ variationId, payload }: Params) {
  return axios.post<StockModel>(`/variations/${variationId}/stock/entry`, payload);
}

type UseInventoryEntry = {
  config?: MutationConfig<typeof inventoryEntry>;
};

function useInventoryEntry({ config }: UseInventoryEntry = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['inventory-entry'],
    mutationFn: (payload) => inventoryEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-entries']);
      queryClient.invalidateQueries(['fetch-stock']);
      addNotification({
        type: 'success',
        message: 'Estoque alterado com sucesso',
      });
    },
  });
}

export { inventoryEntry, useInventoryEntry };
