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
  height: 78px;
  margin-bottom: 1rem;
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  }
`;
