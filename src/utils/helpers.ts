import { isValid } from 'date-fns';

export async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Value = string | boolean | number | File;

export function createFormDataPayload<T extends Record<string, Value>>(data: Partial<T>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      const _value = value instanceof File ? value : value.toString();
      formData.set(key, _value);
    }
  });
  return formData;
}

export function extractChangedValues<T extends Record<string, any | any[]>>(
  original: T,
  updatedObject: Partial<T>,
  ignoreArrays = true
): Partial<T> {
  const result: Partial<T> = {};
  Object.entries(updatedObject).forEach(([key, value]) => {
    if (Array.isArray(value) && !ignoreArrays) {
      result[key as keyof T] = value as any;
    } else if (typeof value !== 'object' && key in original && value !== original[key as keyof T]) {
      result[key as keyof T] = value;
    }
  });
  return result;
}

function parseToBoolean(value: Array<any> | string | number | Record<string, any>): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    if (value instanceof Date) return isValid(value);
    else return Object.values(value).some((i) => !!i);
  }
  return !!value;
}

export function iterableAND(obj?: Record<string, any> | Array<any>): boolean {
  if (!obj) return false;
  if (typeof obj === 'object') obj = Object.values(obj);
  return obj.reduce((acc: boolean, cur: any) => {
    return acc && parseToBoolean(cur);
  }, true);
}

export function iterableOR(obj?: Record<string, any> | Array<any>): boolean {
  if (!obj) return false;
  if (typeof obj === 'object') {
    if (obj instanceof Date) return isValid(obj);
    else obj = Object.values(obj);
  }
  return obj.some((o: any) => !!o);
}

export const UUID_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
