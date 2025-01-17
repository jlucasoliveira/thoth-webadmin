import { Button } from '@chakra-ui/react';
import { downloadFile } from '@/utils/downloadFile';
import { useStockReport } from '../api/exportCSVValidStock';

export function StockExportCSV() {
  const { isLoading, isFetching, refetch } = useStockReport({ config: { enabled: false } });

  async function handleClick() {
    const { data } = await refetch();
    if (data) downloadFile(data, `${Date.now()}-stocks-report.csv`);
  }

  return (
    <Button
      disabled={isLoading && isFetching}
      isLoading={isLoading && isFetching}
      colorScheme="blue"
      size="sm"
      rounded="5"
      px={10}
      onClick={handleClick}
    >
      Exportar CSV
    </Button>
  );
}
