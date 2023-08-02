import * as styles from './input.linaria';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

const Input: React.FC<FormInputProps> = ({ labelText, ...props }) => {
  return (
    <section className={styles.wrapper}>
      <label>{labelText}</label>
      <input {...props} className={styles.input} />
    </section>
  );
};

export default Input;
