import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { MutationConfig } from '@/lib/react-query';
import { AttachmentEntity } from '../types';

export type Payload = Pick<AttachmentEntity, 'variationId'> & {
  resource?: string;
  file: File;
};

async function sendFileToBucket({ file, ...sendData }: Payload) {
  const payload = new FormData();
  payload.append('file', file);

  Object.entries(sendData).map(([key, value]) => {
    payload.append(key, value.toString());
  });

  const { data } = await axios.post<AttachmentEntity>('attachments', payload);

  return data;
}

type UseSendFileToBucket = {
  config?: MutationConfig<typeof sendFileToBucket>;
};

function useSendFileToBucket({ config }: UseSendFileToBucket = {}) {
  return useMutation({
    ...config,
    mutationKey: ['send-file-to-bucket'],
    mutationFn: sendFileToBucket,
  });
}

export { sendFileToBucket, useSendFileToBucket };
