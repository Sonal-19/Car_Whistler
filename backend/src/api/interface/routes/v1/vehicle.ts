import express from "express";
import bodyParser from 'body-parser';
import { validateRequest, verifyTokenUser } from "../../../middlewares";
import { register, signIn, addVehicle, getVehicles, verifyOtp, forgotPassword, resetEmailPassword, getUserProfile, updateUserProfile, addAddress, updateAddress, getAddress, deleteAddress, getDeliveryCharges, vehicleDetails, resendOtp, getVehicleDetails, getUserAddress, getVehiclesByUserId, deleteVehicle, proceedToPayment, getProceedToPayment, createOrder, paymentResponse, getVehicleDetailsById, getOrderDetailsByUserId, getVehicleDetailsByDB, getVirtualNumbersByQRId, getCartItemsByUserId } from "../../controllers/app/vehicle/vehicleController";
import { registerValidate, signInValidate, addVehicleValidate, getVehiclesValidate, verifyOtpValidate, forgotPasswordValidate, resetEmailPasswordValidate, updateUserProfileValidate, addAddressValidate, updateAddressValidate, getDeliveryChargesValidate, getVehicleDetailsValidate, proceedToPaymentValidate, getVirtualNumbersByQRIdValidate, } from "../../../domain/validator/vehicle.validator";
const app = express();
app.use(bodyParser.json());
const router = express.Router()

/** IVR router function */
export const VEHICLE = (router: express.Router): void => {

  router.post("/vehicle/register",  validateRequest(registerValidate), register);
  router.post("/vehicle/verify-otp", validateRequest(verifyOtpValidate), verifyOtp)
  router.post("/vehicle/resend-otp", resendOtp);
  router.post("/vehicle/signin", validateRequest(signInValidate), signIn);
  router.post("/vehicle/forgot-password", validateRequest(forgotPasswordValidate), forgotPassword);
  router.post("/vehicle/reset-email-password", validateRequest(resetEmailPasswordValidate), resetEmailPassword);

  router.get("/vehicle/getUserProfile/:userId", getUserProfile);
  router.put("/vehicle/updateUserProfile/:userId", validateRequest(updateUserProfileValidate), updateUserProfile);


  router.post("/vehicle/addVehicle", validateRequest(addVehicleValidate), addVehicle);
  router.post("/vehicle/vehicleinfo", vehicleDetails);
  router.get("/vehicle/getVehicleDetails/:reg_no", validateRequest(getVehicleDetailsValidate), getVehicleDetails);
  router.get("/vehicle/getVehileDetailsByDB/:reg_no", validateRequest(getVehicleDetailsValidate), getVehicleDetailsByDB);
  router.get("/vehicle/getVehiclesByUserId/:userId", getVehiclesByUserId);
  router.get("/vehicle/getVehicleDetailsById/:vehicleId", getVehicleDetailsById);
  router.delete('/vehicle/deleteVehicle/:vehicleId', deleteVehicle);

  router.post("/vehicle/getVehicles", validateRequest(getVehiclesValidate), getVehicles);

  router.get("/vehicle/getAddress/:userId", getAddress);
  router.get("/vehicle/getUserAddress/:userId", getUserAddress);
  router.post("/vehicle/addAddress", validateRequest(addAddressValidate), addAddress);
  router.put("/vehicle/updateAddress/:addressId", validateRequest(updateAddressValidate), updateAddress);
  router.delete("/vehicle/deleteAddress/:addressId", deleteAddress);

  router.get("/vehicle/getDeliveryCharges/:pincode", validateRequest(getDeliveryChargesValidate), getDeliveryCharges);

  router.post("/vehicle/proceedToPayment", validateRequest(proceedToPaymentValidate), proceedToPayment);
  router.get("/vehicle/getProceedToPayment/:transitionId", getProceedToPayment);
  router.post("/vehicle/createOrder", createOrder);
  router.post("/vehicle/paymentResponse", paymentResponse);

  router.get("/vehicle/getOrderDetailsByUserId/:userId", getOrderDetailsByUserId);

  router.get("/vehicle/getCartItemsByUserId/:userId", getCartItemsByUserId);

  router.get("/vehicle/getVirtualNumbersByQRId/:qrId", validateRequest(getVirtualNumbersByQRIdValidate), getVirtualNumbersByQRId );

};
