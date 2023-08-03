import { css } from '@linaria/core';

export const wrapper = css`
  background-color: var(--tertiary-color);
  border-radius: var(--borderRadius);
  margin: 1rem auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  justify-content: space-between;

  border: 3px solid var(--border-color);
`;
