import * as yup from "yup"


const signUpSchema = yup.object().shape({
    emailId: yup.string().required("Email is required").email(),
    password: yup.string().min(8).max(32).required(),
    name: yup.string().required("Full name is required"),
    username: yup.string().required("Username is required")
});

const loginSchema=yup.object().shape({
    emailId: yup.string().required("Email is required").email(),
    password: yup.string().min(8).max(32).required(),
});

export {signUpSchema,loginSchema}
  