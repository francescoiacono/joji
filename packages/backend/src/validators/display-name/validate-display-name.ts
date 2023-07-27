import { RoomConfig } from '@joji/config';
import { RoomMessage } from '@joji/types';

export const validateDisplayName = (displayName?: string): string | null => {
  if (!displayName?.trim()) {
    return RoomMessage.DisplayNameRequired;
  }
  if (displayName.length > RoomConfig.username.maxLength) {
    return RoomMessage.DisplayNameTooLong;
  }
  return null;
};
