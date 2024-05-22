import { BaseEntity } from '@/types/common';

export enum Size {
  XS = 'XS',
  S = 'S',
  MD = 'MD',
  L = 'L',
  XL = 'XL',
}

export type AttachmentEntity = BaseEntity & {
  key?: string;
  hash?: string;

  // relations
  variationId?: string;
};

export type AttachmentSizeEntity = BaseEntity & {
  attachmentId: string;
  key: string;
  size: Size;
};

export type AttachmentSigned = AttachmentSizeEntity & {
  url: string;
};
