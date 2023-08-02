import { css } from '@linaria/core';

export const globalStyles = css`
  :global() {
    :root {
      --primary-color: #18174a;
      --secondary-color: #3a386a;
      --tertiary-color: #2a264f;

      --border-color: #403e6f;

      --background-color: #19194b;

      --font-color: #fff;
      --font-color-secondary: rgba(255, 255, 255, 0.3);

      --font-size-big: 1.3rem;

      --borderRadius: 18px;
    }

    h1 {
      font-size: 2.25rem;
    }
  }
`;
