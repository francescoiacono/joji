const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const randomString = (length: number): string => {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return result;
};
