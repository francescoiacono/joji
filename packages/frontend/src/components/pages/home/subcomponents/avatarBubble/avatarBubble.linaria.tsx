import { css } from '@linaria/core';

export const wrapper = css`
  position: relative;
  display: inline-block;
`;

export const bubble = css`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  width: 200px;
  height: 200px;
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
  border-radius: 100%;
  padding: 0.3rem;
  color: var(--font-color);

  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    font-weight: bold;
    transform: scale(1.1);
  }
`;
