import { css } from '@linaria/core';

export const primaryButton = css`
  text-transform: uppercase;
  font-weight: bold;
  color: var(--font-color);
  background-color: var(--secondary-color);
  border: 3px solid var(--border-color);
  border-radius: var(--borderRadius);
  width: 100%;
  font-size: var(--font-size-big);
  height: 50px;
  margin-bottom: 1rem;
  cursor: pointer;
`;
