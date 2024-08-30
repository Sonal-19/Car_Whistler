import { Integer } from "read-excel-file/types";
import { object, string, number, mixed } from "yup";
import lan from "../../locales/en.json";


export const getCallDetailsValidate = object({
  body: object({
    pinCode: string().required("Pincode id is required"),
  }),
});