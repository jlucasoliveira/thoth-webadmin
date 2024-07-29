import { Gender } from '../types';

export function translateGender(gender: Gender): string {
  if (gender === Gender.Male) return 'Masculino';
  if (gender === Gender.Female) return 'Feminino';
  return 'Nenhum';
}
