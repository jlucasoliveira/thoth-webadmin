import { Payload } from '../api/createClient';
import { FormType } from '../components/validation';

export function parseFormTypeToPayload(data: FormType): Payload {
  return {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
  };
}
