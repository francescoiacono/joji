interface FormTitleProps {
  children: React.ReactNode;
}

const FormTitle: React.FC<FormTitleProps> = ({ children }) => {
  return (
    <section>
      <h2>{children}</h2>
    </section>
  );
};

export default FormTitle;
