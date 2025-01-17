import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

async function getResumeReport() {
  const { data } = await axios.get<Blob>('/reports/stocks-resume', {
    responseType: 'blob',
  });
  return data;
}

type QueryFcType = typeof getResumeReport;

type UseStockReport = {
  config?: QueryConfig<QueryFcType>;
};

function useStockReport({ config }: UseStockReport = {}) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-stocks-resume-report'],
    queryFn: getResumeReport,
  });
}

export { getResumeReport, useStockReport };
