import Form from '@/components/ui/forms/form/form';
import FormTitle from '@/components/ui/forms/formTitle/formTitle';
import Input from '@/components/ui/input/input';

const RoomForm = () => {
  return (
    <Form>
      <FormTitle>joji.gg</FormTitle>
      <Input labelText='Display Name' />
    </Form>
  );
};

export default RoomForm;
