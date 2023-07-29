import * as yup from 'yup';

export const schemaIsValid = (schema: yup.ObjectSchema<any>, data: any) => {
  try {
    schema.validateSync(data);
    return true;
  } catch (error) {
    return false;
  }
};
