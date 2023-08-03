import { css } from '@linaria/core';

export const box = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
  color: var(--font-color);
  border: 3px solid white;
  border-radius: var(--borderRadius);

  user-select: none;
  filter: opacity(0.3) brightness(2);
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: opacity(1) brightness(2);
  }
`;

export const icon = css`
  color: red !important;
  filter: invert(1);
`;

export const text = css`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const selected = css`
  filter: opacity(1) brightness(2);
`;
