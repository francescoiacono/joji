import PrimaryButton from '../../buttons/primaryButton/primaryButton';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  buttonText?: string;
}

const Form: React.FC<FormProps> = ({ children, buttonText, ...props }) => {
  return (
    <form {...props}>
      {children}
      <PrimaryButton type='submit'>
        {buttonText ? buttonText : 'Create'}
      </PrimaryButton>
    </form>
  );
};

export default Form;
