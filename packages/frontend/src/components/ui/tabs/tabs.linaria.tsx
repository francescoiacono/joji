import { css } from '@linaria/core';

export const wrapper = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const tabs = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.5rem;
  height: 65px;
  background: var(--primary-color);
  border-radius: var(--borderRadius);
`;
