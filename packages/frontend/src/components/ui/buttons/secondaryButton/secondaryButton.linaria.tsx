import { css } from '@linaria/core';

export const secondaryButton = css`
  background-color: var(--primary-color);
  color: var(--font-color-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--borderRadius);
  padding: 0.2rem 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    color: var(--font-color);
    border-color: var(--font-color);
  }
`;
