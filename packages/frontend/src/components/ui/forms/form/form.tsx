import { PrimaryButton } from '@/components/ui/buttons';

import * as styles from './form.linaria';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  buttonText?: string;
  loading?: boolean;
}

const Form: React.FC<FormProps> = ({
  children,
  loading,
  buttonText,
  ...props
}) => {
  return (
    <form className={styles.wrapper} {...props}>
      {children}
      <PrimaryButton loading={loading} type='submit'>
        {buttonText ? buttonText : 'Create'}
      </PrimaryButton>
    </form>
  );
};

export default Form;
