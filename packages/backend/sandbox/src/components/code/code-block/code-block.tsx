import classNames from 'classnames';
import hljs from 'highlight.js';
import styles from './code-block.module.scss';
import { font } from '../font';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export const CodeBlock = (props: CodeBlockProps) => {
  const { children, className } = props;

  return (
    <pre
      className={classNames(styles.codeBlock, font.className, className)}
      dangerouslySetInnerHTML={{
        __html: hljs.highlightAuto(children as string).value
      }}
    />
  );
};
