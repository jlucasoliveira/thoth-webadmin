export function sanitizeNumber(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

export function maskCPF(cpf: string): string {
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
}

export function maskCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2');
  cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
  cnpj = cnpj.replace(/(\d{3})(\d)/, '$1/$2');
  cnpj = cnpj.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  return cnpj;
}

export function documentMask(document: string): string {
  document = sanitizeNumber(document);
  return document.length <= 11 ? maskCPF(document) : maskCNPJ(document);
}

export function phoneMask(phone: string): string {
  phone = sanitizeNumber(phone);
  phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
  return phone;
}

export function zipCodeMask(zipCode: string): string {
  zipCode = sanitizeNumber(zipCode);
  zipCode = zipCode.replace(/(\d{5})(\d)/, '$1-$2');
  return zipCode;
}

export function capitalize(text: string): string {
  const first = text.charAt(0);
  return text.replace(first, first.toUpperCase());
}

export function currencyFormat(value?: number | null) {
  if (!value && value !== 0) return '-';

  return new Intl.NumberFormat('pt-br', {
    currency: 'BRL',
    style: 'currency',
  }).format(value);
}

export function dateFormat(value: string | Date | number | null): string {
  if (value === null) return '-';
  if (typeof value === 'string') value = new Date(value);

  return new Intl.DateTimeFormat('pt-br', { dateStyle: 'short', timeStyle: 'short' }).format(value);
}
