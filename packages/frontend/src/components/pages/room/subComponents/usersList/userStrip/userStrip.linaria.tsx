import { css } from '@linaria/core';

export const wrapper = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  padding: 0.5rem;
  border-radius: var(--borderRadius);
  border: 3px solid var(--border-color);
  gap: 1rem;
`;

export const name = css`
  color: var(--font-color);
  font-size: var(--font-size-big);
  font-weight: bold;
`;

export const userInfo = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
