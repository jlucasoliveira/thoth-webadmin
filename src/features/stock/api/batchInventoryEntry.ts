import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { BaseEntity } from '@/types/common';
import { useNotificationStore } from '@/stores/notifications';
import { StockModel, StockEntryModel } from '@/features/stock/types';

type Item = Omit<StockEntryModel, keyof BaseEntity | 'user'> & {
  variationId: string;
};

export type Payload = {
  entries: Item[];
};

async function batchEntry(payload: Payload) {
  return axios.post<StockModel>(`/stock/batch-entry`, payload);
}

type UseBatchInventoryEntry = {
  config?: MutationConfig<typeof batchEntry>;
};

function useInventoryBatchEntry({ config }: UseBatchInventoryEntry = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['batch-inventory-entry'],
    mutationFn: (payload) => batchEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-variations']);
      addNotification({
        type: 'success',
        message: 'Estoques alterados com sucesso',
      });
      navigate(-1);
    },
  });
}

export { batchEntry, useInventoryBatchEntry };
