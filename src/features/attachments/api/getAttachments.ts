import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { AttachmentEntity } from '@/features/attachments/types';
import { Paginate, Pagination } from '@/types/pagination';

async function getAttachments(params: Pagination<AttachmentEntity>) {
  const { data } = await axios.get<Paginate<AttachmentEntity>>('/attachments', { params });
  return data;
}

type QueryFnType = typeof getAttachments;

type UseAttachments = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<AttachmentEntity>;
};

function useAttachments({ config = {}, params }: UseAttachments) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-attachments', params],
    queryFn: () => getAttachments(params),
  });
}

export { getAttachments, useAttachments };
