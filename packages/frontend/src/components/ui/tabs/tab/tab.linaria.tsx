import { css } from '@linaria/core';

export const tab = css`
  display: flex;
  cursor: pointer;
  height: 50px;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  width: 100%;
  border-radius: 18px;
`;

export const active = css`
  font-weight: bold;
  color: #fff;
  background: #3a386a;
  border: 3px solid #403e6f;
`;
