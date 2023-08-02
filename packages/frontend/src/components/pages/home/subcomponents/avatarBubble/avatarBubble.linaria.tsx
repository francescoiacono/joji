import { css } from '@linaria/core';

export const wrapper = css`
  position: relative;
  display: inline-block;
`;

export const bubble = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  width: 200px;
  height: 200px;
  overflow: hidden;
  margin: 1rem auto 0 auto;
  background-color: var(--primary-color);
`;

export const refreshButton = css`
  position: absolute;
  left: 60%;
  bottom: 0;
  margin: 0.5rem;
  background-color: var(--border-color);
  border: none;
  border-radius: var(--borderRadius);
  padding: 0.25rem 0.7rem;
  color: var(--font-color);

  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;
