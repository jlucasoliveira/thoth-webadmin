import { useInventoryBatchEntry } from '../api/batchInventoryEntry';
import { BatchRegistrationManager } from '../components/BatchRegistration';
import {
  type ItemsSchema,
  parseItemSchemaIntoPayload,
} from '../components/BatchRegistration/validation';

export function BatchRegistration() {
  const { isLoading, mutateAsync } = useInventoryBatchEntry();

  async function onSubmit(data: ItemsSchema) {
    const payload = parseItemSchemaIntoPayload(data.items ?? []);
    await mutateAsync(payload);
  }

  return <BatchRegistrationManager loading={isLoading} onSubmit={onSubmit} />;
}
