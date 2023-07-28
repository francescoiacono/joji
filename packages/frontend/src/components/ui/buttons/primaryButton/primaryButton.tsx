const PrimaryButton = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button {...props}>{props.children}</button>;
};

export default PrimaryButton;
