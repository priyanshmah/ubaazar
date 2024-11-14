import * as Yup from 'yup';

export const addressSchema = Yup.object().shape({
    name: Yup.string()
        .max(25, "Name cannot be more than 25 characters")
        .required("Name is required"),

    mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 numeric digits')
        .required("Mobile number is required"),

    pinCode: Yup.string()
        .matches(/^[1-9]{1}[0-9]{5}$/, 'Pincode must be a 6-digit number starting with a non-zero digit')
        .required("Pincode is required"),

    address: Yup.string()
        .min(3, "Address must be at least 3 characters")
        .required("Address is required"),

    area: Yup.string()
        .min(3, "Area must be at least 3 characters")
        .required("Area is required"),

    city: Yup.string()
        .min(2, "City must be at least 2 characters")
        .required("City is required"),

    state: Yup.string()
        .min(2, "State must be at least 2 characters")
        .required("State is required"),
});