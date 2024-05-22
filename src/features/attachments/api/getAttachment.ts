import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { AttachmentSigned, Size } from '@/features/attachments/types';

async function getAttachment(id: string, size?: string) {
  const { data } = await axios.get<AttachmentSigned>(`/attachments/${id}`, { params: { size } });
  return data;
}

type QueryFnType = typeof getAttachment;

type UseGetAttachment = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
  size?: Size;
};

function useGetAttachment({ config = {}, id, size }: UseGetAttachment) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-attachment', id, size],
    queryFn: () => getAttachment(id!, size),
    enabled: !!id,
  });
}

export { getAttachment, useGetAttachment };
