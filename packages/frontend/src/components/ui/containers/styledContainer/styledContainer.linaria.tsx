import { css } from '@linaria/core';

export const wrapper = css`
  background-color: var(--tertiary-color);
  border-radius: var(--borderRadius);
  padding: 1rem;
  margin: auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  border: 3px solid var(--border-color);
`;
