import { css } from '@linaria/core';

export const tab = css`
  display: flex;
  cursor: pointer;
  height: 50px;
  align-items: center;
  justify-content: center;
  color: var(--font-color-secondary);
  text-transform: uppercase;
  width: 100%;
  border-radius: var(--borderRadius);
  font-size: var(--font-size-big);
`;

export const active = css`
  font-weight: bold;
  color: var(--font-color);
  background: var(--secondary-color);
  border: 3px solid var(--border-color);
`;
