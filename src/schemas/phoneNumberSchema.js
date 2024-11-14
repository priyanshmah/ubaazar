import * as Yup from 'yup';

export const phoneNumberSchema = Yup.object().shape({
    mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 numeric digits')
        .required("Mobile number is required")
})