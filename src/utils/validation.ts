import { sanitizeNumber } from './format';

function sumHelper(weights: number[] | number) {
  const helper = (index: number) => (Array.isArray(weights) ? weights[index] : weights - index);
  return (p: number, c: number, i: number) => p + c * helper(i);
}

function resolveVerifierCPF(sum: number, checkNumber: number): number {
  const verifier = checkNumber - (sum % checkNumber);
  return verifier > 9 ? 0 : verifier;
}

function validateCPF(cpf: string): boolean {
  const digits = cpf.split('').flatMap((d) => parseInt(d, 10));

  const firstVerifierSum = digits.slice(0, 9).reduce(sumHelper(10), 0);
  const firstVerifier = resolveVerifierCPF(firstVerifierSum, 11);

  if (cpf[9] !== firstVerifier.toString()) return false;

  const secondVerifierSum = digits.slice(0, 10).reduce(sumHelper(11), 0);
  const secondVerifier = resolveVerifierCPF(secondVerifierSum, 11);

  if (cpf[10] !== secondVerifier.toString()) return false;

  return true;
}

function resolveVerifierCNPJ(sum: number, checkNumber: number): number {
  const verifier = sum % checkNumber;
  return verifier < 2 ? 0 : 11 - verifier;
}

function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.split('').flatMap((d) => parseInt(d, 10));

  const firstVerifierWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstVerifierSum = digits.slice(0, 12).reduce(sumHelper(firstVerifierWeights), 0);
  const firstVerifier = resolveVerifierCNPJ(firstVerifierSum, 11);

  if (cnpj[12] !== firstVerifier.toString()) return false;

  const secondVerifierWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondVerifierSum = digits.slice(0, 13).reduce(sumHelper(secondVerifierWeights), 0);
  const secondVerifier = resolveVerifierCNPJ(secondVerifierSum, 11);

  if (cnpj[13] !== secondVerifier.toString()) return false;

  return true;
}

export function validateDocument(document: string): boolean {
  document = sanitizeNumber(document);
  if (document.length === 11) return validateCPF(document);
  else if (document.length === 14) return validateCNPJ(document);
  return false;
}

export function validatePhone(phone: string): boolean {
  const validation = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  return validation.test(phone);
}
