import classNames from 'classnames';
import { font } from '../font';

interface InlineCodeProps {
  children?: React.ReactNode;
  className?: string;
}

export const InlineCode = (props: InlineCodeProps) => {
  const { children, className } = props;

  return (
    <code className={classNames(font.className, className)}>{children}</code>
  );
};
