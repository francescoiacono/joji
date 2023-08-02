import { css } from '@linaria/core';

export const wrapper = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const input = css`
  background-color: var(--primary-color);
  border: none;
  border-radius: var(--borderRadius);
  height: 50px;
  color: var(--font-color);
  padding: 0 1rem;

  &::placeholder {
    color: var(--font-color-secondary);
    font-style: italic;
  }

  &:focus {
    outline: none;
  }
`;
