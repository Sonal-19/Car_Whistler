import { Integer } from "read-excel-file/types";
import { object, string, number, mixed } from "yup";
import lan from "../../locales/en.json";


export const registerValidate = object({
  body: object({
    email: string().required("Email is required"),
    fullName: string().required("Name is required"),
    password: number().required("Password is required"),
    phone: number().required("Phone is required"),
  }),
});

export const verifyOtpValidate = object({
  body: object({
    otp: string().required("OTP is required")
  }),
});

export const signInValidate = object({
  body: object({
    username: string().required("Username is required"),
    password: string().required("Password is required"),
  }),
});

export const forgotPasswordValidate = object({
  body: object({
    email: string().required("Email is required"),
  }),
});

export const resetEmailPasswordValidate = object({
  body: object({
    newPassword: string().required("Password is required"),
  }),
});

export const updateUserProfileValidate = object({
  body: object({
    email: string().required("Email is required"),
    fullName: string().required("Name is required"),
    password: number().required("Password is required"),
    phone: number().required("Phone is required"),
  }),
});

export const addAddressValidate = object({
  body: object({
    name: string().required("Name is required"),
    address: string(). required("Address is required"),
    state: string().required("state is required"),
    city: string().required("City is required"),
    pincode: string().required("Pincode is required"),
    phone: number().required("Number is required"),
  }),
});

export const updateAddressValidate = object({
  body: object({
    address: string(). required("Email is required"),
    name: string().required("Name is required"),
    phone: number().required("Number is required"),
  }),
});

export const addVehicleValidate = object({
  body: object({
    userId: string().required("User id is required"),
    phone: string().required("phone is required"),
    registrationNumber: string().required("Registration Number is required"),
  }),
});

export const getVehicleDetailsValidate = object({
  body: object({
    // reg_no: string().required("Registration number is required"),
  }),
});

export const qrValidate = object({
  body: object({
    qrId: string().required("Qr id is required"),
  }),
});

export const getVehiclesValidate = object({
  body: object({
    userId: string().required("User id is required"),
  }),
});

export const getChargesEstimateValidate = object({
  body: object({
    pinCode: string().required("Pincode id is required"),
  }),
});

export const getDeliveryChargesValidate = object({
  params: object({
    pincode: string().required("Pincode is required"),
  }),
});

export const proceedToPaymentValidate = object({
  body: object({
    vehicleId: string().required("Vehicle ID is required"),
    userId: string().required("User ID is required"),
    addressId: string().optional(), 
    sticker_charge: string().optional(),
    delivery_charge: number().required("delivery_charge is required").min(0, "delivery_charge must be a positive number"),
    // amount: number().required("Amount is required").min(0, "Amount must be a positive number"),
    insertDateTime: string().required("Insert date and time is required"),
  }),
});

export const getVirtualNumbersByQRIdValidate = object({
  params: object({
    qrId: string().required("qrId is required")
  })
})



