interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

const Input: React.FC<FormInputProps> = ({ labelText, ...props }) => {
  return (
    <section>
      <label>{labelText}</label>
      <input {...props} />
    </section>
  );
};

export default Input;
