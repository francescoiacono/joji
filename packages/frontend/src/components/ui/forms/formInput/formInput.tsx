interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

const FormInput: React.FC<FormInputProps> = ({ labelText, ...props }) => {
  return (
    <section>
      <label>{labelText}</label>
      <input {...props} />
    </section>
  );
};

export default FormInput;
