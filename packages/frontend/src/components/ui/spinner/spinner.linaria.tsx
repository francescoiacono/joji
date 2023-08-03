import { css } from '@linaria/core';

export const loader = css`
  border: 5px solid var(--primary-color);
  border-top: 5px solid var(--font-color);
  border-radius: 50%;
  width: 27px;
  height: 27px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const large = css`
  border: 16px solid var(--primary-color);
  border-top: 16px solid var(--font-color);

  width: 150px;
  height: 150px;
`;
