import { Request, Response } from "express";
import request, { Response as RequestResponse } from "request";
import { ErrorResponse, ErrorResWithSuccess, SuccessResponse, ErrorEmptyResponse, notFoundResponse, userExistsError } from "../../../../helpers/apiResponse";
import { sign, randomValueHex } from "../../../../lib/jwt";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";
import { REGISTER, VEHICLE_DETAIL, QR_CODE, ADDRESS_DETAIL, DELIVERY_CHARGES, PAYMENT_CAR_WHISTLER, CART, VIRTUAL_NUMBERS, VIRTUAL_MAPPING } from "../../../../../api/domain/schema/vehicle.schema";
import fs from "fs";
import { sendOtpEmail } from "../../../../lib/mailer";
import { sendResetPasswordEmail } from "../../../../lib/resetPasswordEmail";
import path from "path";
import axios from "axios";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// import { MailSent } from "../../../../lib/mailer";
let uploadPath = env.IVR_FLOW_FILE_PATH;

/**
 * get settings.
 *
 * @returns {Object}
 */

// interface VehicleDetails {
//   [key: string]: any;
// }

interface Payment {
  vehicleId: { reg_no: string };
  addressDetail: { [key: string]: string };
  amount: number;
  paymentStatus: string;
}


export const vehicleDetails = async (req: Request, res: Response) => {
  const { reg_no } = req.body;

  if (!reg_no) {
    return ErrorResponse(res, "Registration number is required");
  }

  const filePath = path.join(__dirname, 'vehicleData.json');
  console.log('File path:', filePath);

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');

    if (!data) {
      return ErrorResponse(res, "Vehicle data file is empty");
    }
    const vehicleData = JSON.parse(data);

    if (!vehicleData) {
      return ErrorResponse(res, "Vehicle data not found");
    }

    // Ensure registration number is updated in the vehicle data
    vehicleData.reg_no = reg_no;
    vehicleData.vehicle_insurance_details.reg_no = reg_no;
    vehicleData.permit_details.reg_no = reg_no;
    vehicleData.latest_tax_details.reg_no = reg_no;

    return res.json({ result: vehicleData });
  } catch (e) {
    glogger("/vehicle/vehicleinfo", "vehicleinfo", "", e);
    return ErrorResponse(res, "Error reading or parsing vehicle data file");
  }
};

export const addVehicle = async (req: Request, res: Response): Promise<void> => {
  const { registrationNumber, userId, phone, insertDateTime } = req.body;

  if (!registrationNumber || !userId || !phone || !insertDateTime) {
    return ErrorResponse(res, "Required fields missing");
  }

  try {
    const existingVehicle = await VEHICLE_DETAIL.findOne({ reg_no: registrationNumber });
    if (existingVehicle) {
      return ErrorResponse(res, "Registration number already exists");
    }

    console.log("Requesting vehicle info for reg_no:", registrationNumber);
    const response = await axios.post('http://localhost:3000/v1/vehicle/vehicleinfo', { reg_no: registrationNumber });
    //console.log("Received vehicle info:", response.data);

    console.log("Response status:", response.status);
    if (response.status >= 200 && response.status < 300) {
      console.log("Received vehicle info:", response.data);
    } else {
      console.error("Error fetching vehicle info:", response.status, response.statusText);
      return ErrorResponse(res, "Failed to fetch vehicle information");
    }

    const vehicleDetails = response.data.result;

    const vehicleData = { ...vehicleDetails, userId, phone, insertDateTime, };

    const convertToDate = (dateString: any) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date : null;
    };

    // Convert dates in vehicle_pucc_details and latest_tax_details to Date objects
    if (vehicleData.vehicle_pucc_details) {
      vehicleData.vehicle_pucc_details.pucc_from = convertToDate(vehicleData.vehicle_pucc_details.pucc_from);
      vehicleData.vehicle_pucc_details.pucc_upto = convertToDate(vehicleData.vehicle_pucc_details.pucc_upto);
      vehicleData.vehicle_pucc_details.op_dt = convertToDate(vehicleData.vehicle_pucc_details.op_dt);
    }
    if (vehicleData.latest_tax_details) {
      vehicleData.latest_tax_details.rcpt_dt = convertToDate(vehicleData.latest_tax_details.rcpt_dt);
      vehicleData.latest_tax_details.tax_from = convertToDate(vehicleData.latest_tax_details.tax_from);
      vehicleData.latest_tax_details.tax_upto = convertToDate(vehicleData.latest_tax_details.tax_upto);
    }

    const newVehicle = await VEHICLE_DETAIL.create(vehicleData);

    await CART.create({
      userId: userId,
      vehicleId: newVehicle._id,
      insertDateTime: insertDateTime,
    });

    return SuccessResponse(res, "Vehicle added successfully", vehicleData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching vehicle info:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      return ErrorResponse(res, "Error fetching vehicle information");
    }
    glogger("/vehicle/addVehicle", "addVehicle", "", error);
    return ErrorResponse(res, "Error adding vehicle");
  }
};

export const getVehicleDetails = async (req: Request, res: Response) => {
  const { reg_no } = req.params;
  console.log("Received reg_no:", reg_no);

  if (!reg_no) {
    return ErrorResponse(res, "Registration number is required");
  }
  try {
    const filePath = path.join(__dirname, 'vehicleData.json');
    const data = await fs.promises.readFile(filePath, 'utf8');
    if (!data) {
      return ErrorResponse(res, "Vehicle data file is empty");
    }

    const vehicleData = JSON.parse(data);

    if (!vehicleData) {
      return ErrorResponse(res, "Vehicle data not found");
    }

    // Update the reg_no in the vehicle data
    vehicleData.reg_no = reg_no;
    // vehicleData.vehicle_insurance_details.reg_no = reg_no;
    // vehicleData.permit_details.reg_no = reg_no;
    // vehicleData.latest_tax_details.reg_no = reg_no;

    return SuccessResponse(res, "Vehicle details fetched successfully", vehicleData);
  } catch (e) {
    console.error("Error fetching vehicle details:", e);
    glogger("/vehicle/getVehileDetails", "getVehileDetails", "", e);
    return ErrorResponse(res, "Error fetching vehicle");
  }
};

export const getVehicleDetailsByDB = async (req: Request, res: Response) => {
  const { reg_no } = req.params;
  console.log("Received reg_no:", reg_no);

  if (!reg_no) {
    return ErrorResponse(res, "Registration number is required");
  }
  try {
    const vehicle = await VEHICLE_DETAIL.findOne({ reg_no });
    if (!vehicle) {
      return ErrorResponse(res, "Vehicle not found");
    }
    return SuccessResponse(res, "Vehicle details fetched successfully", vehicle);
  } catch (e) {
    glogger("/vehicle/getVehileDetailsByDb", "getVehileDetailsByDB", "", e);
    return ErrorResponse(res, "Error fetching vehicle");
  }
};

export const getVehiclesByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return ErrorResponse(res, "User not found");
  }
  try {
    const vehicles = await VEHICLE_DETAIL.find({ userId });
    if (!vehicles || vehicles.length === 0) {
      return ErrorResponse(res, "Vehicle not found");
    }
    return SuccessResponse(res, "Vehicle details fetched successfully", vehicles);
  } catch (e) {
    glogger("/vehicle/getVehilesByUserId", "getVehilesByUserId", "", e);
    return ErrorResponse(res, "Error fetching vehicle");
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  if (!vehicleId) {
    console.log("Vehicle ID not provided.");
    return ErrorResponse(res, "Vehicle ID is required");
  }

  try {
    console.log(`Attempting to delete vehicle with ID: ${vehicleId}`);

    const deletedVehicle = await VEHICLE_DETAIL.findByIdAndDelete(vehicleId);
    console.log('Deleted vehicle:', deletedVehicle);

    if (!deletedVehicle) {
      console.log(`Vehicle with ID: ${vehicleId} not found or already deleted.`);
      return ErrorResponse(res, "Vehicle not found or already deleted");
    }

    console.log(`Vehicle with ID: ${vehicleId} deleted successfully.`);
    return SuccessResponse(res, "Vehicle deleted successfully", deletedVehicle);
  } catch (e) {
    console.log(`Error occurred while deleting vehicle with ID: ${vehicleId}:`, e);
    glogger("/vehicle/deleteVehicle", "deleteVehicle", "", e);
    return ErrorResponse(res, "Error deleting vehicle");
  }
};

export const getVehicleDetailsById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  if (!vehicleId) {
    return ErrorResponse(res, "Vehicle ID is required.");
  }

  try {
    const vehicle = await VEHICLE_DETAIL.findById(vehicleId);
    if (!vehicle) {
      return ErrorResponse(res, "Vehicle not found.");
    }
    return SuccessResponse(res, "Vehicle details fetched successfully.", vehicle);
  } catch (e) {
    glogger("/getVehicleDetailsById", "getVehicleDetailsById", "", e);
    return ErrorResponse(res, "Error fetching vehicle details");
  }
};

// export const addVehicle = async (req: Request, res: Response) => {
//   try {
//     const { registrationNumber, userId, insertDateTime } = req.body;
//     console.log('Request Body:', req.body);
//     console.log('Registration Number:', registrationNumber);

//     if (!registrationNumber || !userId || !insertDateTime) {
//       return ErrorResponse(res, "Required fields missing");
//     }

//     const existingVehicle = await VEHICLE_DETAIL.findOne({ reg_no: registrationNumber });
//     if (existingVehicle) {
//       return userExistsError(res, "Registration number already exists");
//     }

//     const options = {
//       method: 'POST',
//       url: 'https://rto-vehicle-information-verification-india.p.rapidapi.com/api/v1/rc/vehicleinfo',
//       headers: {
//         'x-rapidapi-key': 'c7dc3b80b4msh7e17afc4270bbf6p1656dejsn0a677921db35',
//         // 'x-rapidapi-key': 'c550db14a5mshfc961ea62174755p14d083jsn6a6f709976b6',
//         'x-rapidapi-host': 'rto-vehicle-information-verification-india.p.rapidapi.com',
//         'Content-Type': 'application/json'
//       },
//       body: {
//         reg_no: registrationNumber,
//         consent: 'Y',
//         consent_text: 'I hereby declare my consent agreement for fetching my information via AITAN Labs API'
//       },
//       json: true
//     };

//     request(options, async (error: any, response: any, body: any) => {
//       if (error) {
//         glogger("ERR", "/vehicle/addVehicle", "addVehicle", error);
//         return ErrorEmptyResponse(res, error);
//       }
//       // console.log('API Response:', response);
//       // console.log('API Body:', body);

//       if (response && response.statusCode === 200 && body && body.result) {
//         const vehicleData = {
//           ...body.result,
//           userId,
//           insertDateTime,
//         };

//         // convert date strings to Date objects
//         const convertToDate = (dateString: any) => {
//           const date = new Date(dateString);
//           return isNaN(date.getTime()) ? null : date; 
//         };

//         // Convert dates in vehicle_pucc_details and latest_tax_details to Date objects
//         if (vehicleData.vehicle_pucc_details) {
//           vehicleData.vehicle_pucc_details.pucc_from = convertToDate(vehicleData.vehicle_pucc_details.pucc_from);
//           vehicleData.vehicle_pucc_details.pucc_upto = convertToDate(vehicleData.vehicle_pucc_details.pucc_upto);
//           vehicleData.vehicle_pucc_details.op_dt = convertToDate(vehicleData.vehicle_pucc_details.op_dt);
//         }

//         if (vehicleData.latest_tax_details) {
//           vehicleData.latest_tax_details.rcpt_dt = convertToDate(vehicleData.latest_tax_details.rcpt_dt);
//           vehicleData.latest_tax_details.tax_from = convertToDate(vehicleData.latest_tax_details.tax_from);
//           vehicleData.latest_tax_details.tax_upto = convertToDate(vehicleData.latest_tax_details.tax_upto);
//         }

//         // Convert other date fields if necessary
//         ['reg_date', 'purchase_date', 'verified_on', 'reg_upto', 'fit_upto'].forEach((dateField) => {
//           vehicleData[dateField] = convertToDate(vehicleData[dateField]);
//         });

//         console.log(vehicleData);

//         const vehicle = new VEHICLE_DETAIL(vehicleData);
//         console.log('Vehicle Data:', vehicleData)
//         await vehicle.save();

//         return SuccessResponse(res, "Vehicle added successfully", vehicle);
//       } else {
//         return ErrorEmptyResponse(res, body.message || "No data returned from external API");
//       }
//     });
//   } catch (e) {
//     glogger("ERR", "/vehicle/addVehicle", "addVehicle", e);
//     return ErrorResponse(res, e);
//   }
// };

export const register = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      email: req.body.email ? req.body.email : "",
      fullName: req.body.fullName ? req.body.fullName : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      password: req.body.password ? req.body.password : "",
      confirmPassword: req.body.confirmPassword ? req.body.confirmPassword : "",
      phone: req.body.phone ? "+91" + req.body.phone : "",
      userToken: req.body.userToken ? req.body.userToken : "",
    };

    const existingUser = await REGISTER.findOne({ $or: [{ email: reqData.email }, { phone: reqData.phone }] });
    if (existingUser) {
      return userExistsError(res, "User already exists.")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    reqData["otp"] = otp;
    reqData["otpExpireTime"] = new Date(new Date().getTime() + 2 * 60000);

    const users = new REGISTER(reqData);
    await users.save();

    await sendOtpEmail(reqData.email, otp);

    return SuccessResponse(res, "Successfully Registered. Please verify your email with the OTP sent to you", users);
  } catch (e) {
    glogger("/vehicle/register", "register", "", e);
    ErrorResponse(res, e);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    const user = await REGISTER.findOne({ otp: otp.trim() });
    console.log("is user there:- ", user)
    if (!user) {
      return ErrorResponse(res, 'Invalid OTP.');
    }

    if (user) {
      const currentTime = new Date();
      if (currentTime > user.otpExpireTime) {
        return ErrorResponse(res, "OTP has expired. Please request a new one.");
      }

      user.verified = true;
      await user.save();
      console.log('User verification successful:', user);

      // Generate token 
      let customResponse: any = {
        userId: user._id,
        fullName: user.fullName,
        phone: user.phone,
      };
      let expireIn: any = env.JWT_TIMEOUT_DURATION;
      const token = sign(customResponse, expireIn);
      customResponse.access_token = token;
      customResponse.token_type = "Bearer";

      await REGISTER.findByIdAndUpdate({ _id: user._id }, { $set: { userToken: token } },);

      return SuccessResponse(res, "Email verified successfully.", { userId: user._id, token });
    } else {
      console.log('Incorrect OTP. Verification failed.')
      return ErrorResponse(res, "Invalid OTP.");
    }

  } catch (e) {
    glogger("/vehicle/verify-otp", "verifyOtp", "", e);
    ErrorResponse(res, e);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await REGISTER.findOne({ email: email.trim() });
    if (!user) {
      return ErrorResponse(res, 'User not found.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpireTime = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);
    return SuccessResponse(res, 'New OTP sent to your email.', user);
  } catch (e) {
    glogger('/vehicle/resend-otp', 'resendOtp', '', e);
    ErrorResponse(res, e);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    let reqData: any = [{ email: req.body.username }, { phone: "+91" + req.body.username }];

    REGISTER.findOne({
      $or: reqData,
    }).exec((err: any, user: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (!user) {
          return notFoundResponse(res, "User Not found.");
        }

        if (req.body.password != user.password) {
          return notFoundResponse(res, "Invalid Password!");
        }

        if (!user.verified) {
          return ErrorResponse(res, "Please verify your email before logging in.");
        }

        let customResponse: any = {
          userId: user._id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
        };

        let expireIn: any = env.JWT_TIMEOUT_DURATION;
        const token = sign(customResponse, expireIn);
        customResponse.access_token = token;
        customResponse.token_type = "Bearer";

        REGISTER.findByIdAndUpdate({ _id: user._id }, { $set: { userToken: token } }, function (err: any, result: any) {
          if (err) {
            return notFoundResponse(res, err);
          } else {
            return SuccessResponse(res, "Logged in successfully", customResponse);
          }
        });
      }
    });
  } catch (e) {
    glogger("/vehicle/signin", "signIn", "", e);
    ErrorResponse(res, e);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await REGISTER.findOne({ email });

    if (!user) {
      return ErrorResponse(res, "User not found.")
    }

    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = resetOTP;
    await user.save();

    await sendResetPasswordEmail(email, resetOTP);

    return SuccessResponse(res, "Successfully Email sent. Please verify your email with the OTP sent to you", user);
  } catch (e) {
    glogger("/vehicle/forgot-password", "forgotPassword", "", e);
    ErrorResponse(res, e);
  }
};

export const resetEmailPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetOTP, newPassword, newconfirmPassword } = req.body;
    console.log("Received details:", { email, resetOTP, newPassword, newconfirmPassword });

    const user = await REGISTER.findOne({ email, resetOTP: resetOTP.trim() });

    if (!user) {
      return ErrorResponse(res, "Invalid OTP.");
    }

    if (newPassword.length < 6) {
      return ErrorResponse(res, "Password must be at least 6 characters long.");
    }

    if (newPassword !== newconfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    user.password = newPassword;
    user.confirmPassword = newconfirmPassword;
    // user.resetOTP = resetOTP;
    await user.save();
    console.log("User New Password:", { newPassword, newconfirmPassword });

    return SuccessResponse(res, "Password reset successfully.", user);
  } catch (e) {
    glogger("/vehicle/reset-email-password", "resetEmailPassword", "", e);
    ErrorResponse(res, e);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await REGISTER.findById(userId);

    if (!user) {
      return notFoundResponse(res, "User not found.");
    }
    return SuccessResponse(res, "User Profile retrieved successfully", user);
  } catch (error) {
    return ErrorResponse(res, error);
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    console.log('File:', req.file);
    console.log('Body:', req.body);
    console.log(req.headers);
    const userId = req.params.userId;
    const updatedData = req.body;

    console.log('Updated Data:', updatedData);
    const user = await REGISTER.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!user) {
      return notFoundResponse(res, "User not found");
    }
    return SuccessResponse(res, "User profile updated successfully", user);
  } catch (error) {
    return ErrorResponse(res, error);
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const { userId, name, address, state, city, pincode, phone, insertDateTime } = req.body;

    const deliveryCharge = await DELIVERY_CHARGES.findOne({ pincode });
    if (!deliveryCharge) {
      return ErrorResponse(res, "We do not deliver to this location yet, change pincode.")
    }

    const newAddress = new ADDRESS_DETAIL({
      userId,
      name,
      address,
      state,
      city,
      pincode,
      phone,
      insertDateTime,
    });

    await newAddress.save();
    return SuccessResponse(res, "Address added successfully.", newAddress);
  } catch (e) {
    glogger("/vehicle/addAddress", "addAddress", "", e)
    return ErrorResponse(res, e);
  }
};

export const getAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const address = await ADDRESS_DETAIL.find({ userId });

    return SuccessResponse(res, "Addresses retrieved successfully.", address);
  } catch (e) {
    glogger("/vehicle/getAddress", "getAddress", "", e);
    return ErrorResponse(res, e);
  }
};

export const getUserAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const address = await ADDRESS_DETAIL.find({ userId }).sort({ insertDateTime: -1 });

    if (!address) {
      return SuccessResponse(res, "No addresses found.", null);
    }

    return SuccessResponse(res, "Address retrieved successfully.", address);
  } catch (e) {
    glogger("/vehicle/getUserAddress", "getUserAddress", "", e);
    return ErrorResponse(res, e);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.addressId;
    const updateData = req.body;

    const deliveryCharge = await DELIVERY_CHARGES.findOne({ pincode: updateData.pincode });
    if (!deliveryCharge) {
      return ErrorResponse(res, "We do not deliver to this location yet, change pincode.")
    }

    console.log('Updated Data:', updateData);
    const updateAddress = await ADDRESS_DETAIL.findByIdAndUpdate(addressId, updateData,
      { new: true });

    if (!updateAddress) {
      return ErrorResponse(res, "Address not found.");
    }
    return SuccessResponse(res, "Address updated successfully.", updateAddress);
  } catch (e) {
    glogger("/vehicle/updateAddress", "updateAddress", "", e);
    return ErrorResponse(res, e);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await ADDRESS_DETAIL.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return ErrorResponse(res, "Address not found.");
    }
    return SuccessResponse(res, "Address deleted successfully.", deletedAddress);
  } catch (e) {
    glogger("/vehicle/deleteAddress", "deleteAddress", "", e);
    return ErrorResponse(res, e);
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await VEHICLE_DETAIL.find({ userId: req.body.userId }).exec();
    if (!vehicles || vehicles.length === 0) {
      return notFoundResponse(res, "No vehicles found.");
    }
    return SuccessResponse(res, "Successfully listed", vehicles);
  } catch (e) {
    glogger("ERR", "/vehicle/getVehicles", "getVehicles", e);
    return ErrorResponse(res, e);
  }
};

export const getCartItemsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return ErrorResponse(res, "User Id is required");
  }
  try {
    const cartItems = await CART.find({ userId }).populate('vehicleId');

    if (cartItems.length === 0) {
      return SuccessResponse(res, "No cart items found for this user", []);
    }

    return SuccessResponse(res, "Cart items retrieved successfully", cartItems);
  } catch (error) {
    glogger("/cart/getCartItemsByUserId", "getCartItemsByUserId", "", error);
    console.error('Error retrieving cart items:', error);
    return ErrorResponse(res, "An error occurred while retrieving cart items");
  }
};

export const getDeliveryCharges = async (req: Request, res: Response) => {
  try {
    const { pincode } = req.params;

    const deliveryCharge = await DELIVERY_CHARGES.findOne({ pincode });

    if (!deliveryCharge) {
      return ErrorResponse(res, "No delivery charges found for this pincode.");
    }

    return SuccessResponse(res, "Delivery charges retrieved successfully.", deliveryCharge);
  } catch (e) {
    glogger("/vehicle/getDeliveryCharges", "getDeliveryCharges", "", e);
    return ErrorResponse(res, e);
  }
};

export const proceedToPayment = async (req: Request, res: Response) => {
  const { vehicleId, userId, addressId, addressDetail,sticker_charge, delivery_charge, insertDateTime, } = req.body;
  if (!vehicleId || !userId || !delivery_charge) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const transitionId = crypto.randomBytes(16).toString('hex');

    const amount = (sticker_charge || 0) + delivery_charge;

    const payment = new PAYMENT_CAR_WHISTLER({
      transitionId,
      userId,
      vehicleId,
      addressId,
      addressDetail,
      sticker_charge: sticker_charge || 0,
      delivery_charge,
      amount,
      payment_by: 'Car Whistler',
      insertDateTime,
    });

    await payment.save();

    return SuccessResponse(res, 'Payment processed successfully', { transitionId });
  } catch (e) {
    glogger("/vehicle/proceedToPayment", "proceedToPayment", "", e)
    return ErrorResponse(res, e);
  }
};

export const getProceedToPayment = async (req: Request, res: Response) => {
  const { transitionId } = req.params;
  try {
    const payment = await PAYMENT_CAR_WHISTLER.findOne({ transitionId });
    if (!payment) {
      return notFoundResponse(res, "Payment not found.");
    }

    return SuccessResponse(res, "Payment retrieved successfully.", payment);
  } catch (e) {
    glogger("/vehicle/getProceedToPayment", "getProceedToPayment", "", e);
    return ErrorResponse(res, e);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { transitionId, amount, userId } = req.body;

  try {
    const user = await REGISTER.findById(userId).select('fullName email phone');
    if (!user) {
      return ErrorResponse(res, 'User not found');
    }
    const orderData = {
      username: user.fullName,
      amount: amount,
      other_info: 'otherinformation',
      payment_by: 'car whistler',
      mobileNumber: user.phone,
      email: user.email,
      transaction_id: transitionId
    };

    //API
    const response = await axios.post(env.PAYMENT_SITE_URL + 'payment/createOrder', orderData);
    if (response.data.status === 1) {
      await PAYMENT_CAR_WHISTLER.updateOne(
        { transitionId },
        {
          $set: {
            orderId: response.data.data.payment_info.order_id,
            paymentMode: response.data.data.payment_info.mode
          }
        }
      );
      return SuccessResponse(res, response.data.message, response.data.data);
    } else {
      return ErrorResponse(res, 'Order creation failed');
    }
  } catch (e) {
    glogger("/vehicle/createOrder", "createOrder", "", e);
    ErrorResponse(res, e);
  }
};

export const paymentResponse = async (req: Request, res: Response) => {
  const { order_id } = req.body;

  try {
    const paymentData = { order_id: order_id };

    const response = await axios.post(env.PAYMENT_SITE_URL + 'payment/paymentResponse', paymentData);

    if (response.data.status === 'captured') {
      await PAYMENT_CAR_WHISTLER.updateOne(
        { orderId: order_id },
        { $set: { paymentStatus: 'success' } }
      );

      const paymentDetails = await PAYMENT_CAR_WHISTLER.findOne({ orderId: order_id }).populate('vehicleId');
      if (!paymentDetails) {
        return ErrorResponse(res, 'Payment details not found');
      }

      const vehicle = paymentDetails.vehicleId;
      if (!vehicle) {
        return ErrorResponse(res, 'Vehicle details not found');
      }

      const qrCode = await QR_CODE.findOneAndUpdate(
        { status: 0 },
        { $set: { status: 1 } },
        { new: true }
      );

      if (!qrCode) {
        return ErrorResponse(res, 'No available QR codes');
      }

      await VEHICLE_DETAIL.updateOne(
        { _id: vehicle._id },
        { $set: { qrId: qrCode.qrId } }
      );

      await CART.deleteOne({ vehicleId: vehicle._id });

      return SuccessResponse(res, 'Payment successful', {

      });
    } else {
      return ErrorResponse(res, 'Payment verification failed');
    }
  } catch (e) {
    glogger("/vehicle/paymentResponse", "paymentResponse", "", e);
    console.error('Error processing payment response:', e);
    return ErrorResponse(res, 'An error occurred while processing the payment');
  }
};

export const getOrderDetailsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const payments = await PAYMENT_CAR_WHISTLER.find({ userId, paymentStatus: 'success' })
      .populate('vehicleId', 'reg_no')
      .populate('addressId')
      .exec();

    if (!payments.length) {
      return ErrorResponse(res, 'No orders found for this user.');
    }

    const orderDetails = payments.map((payment: Payment) => ({
      vehicleNumber: payment.vehicleId?.reg_no || 'N/A',
      addressDetail: payment.addressDetail || 'N/A',
      amount: payment.amount,
      paymentStatus: payment.paymentStatus,
    }));

    return SuccessResponse(res, 'Order details retrieved successfully.', orderDetails);
  } catch (e) {
    glogger("/vehicle/getOrderDetailsByUserId", "getOrderDetailsByUserId", "", e);
    return ErrorResponse(res, 'An error occurred while retrieving order details.');
  }
};

export const getVirtualNumbersByQRId = async (req: Request, res: Response) => {
  const { qrId } = req.params;

  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 1 * 60000); // 5 minutes ago

    const vehicleOwnerDertails = await VEHICLE_DETAIL.findOne({ qrId }).lean();

    if (!vehicleOwnerDertails) {
      return ErrorEmptyResponse(res, 'Vehicle details not found for the provided qrId.');
    }

    const { phone } = vehicleOwnerDertails;
    let mapping = await VIRTUAL_MAPPING.findOne({
      qrId,
      expiresAt: { $gte: fiveMinutesAgo }
    }).lean();

    if (mapping) {
      return SuccessResponse(res, 'Virtual number reassigned successfully', { virtualNumber: mapping.virtual_number });
    }

    let availableNumber = await VIRTUAL_NUMBERS.aggregate([
      {
        $lookup: {
          from: 'virtual_mappings',
          let: { virtual_number: '$virtual_number' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$virtual_number', '$$virtual_number'] },
                    { $gte: ['$expiresAt', fiveMinutesAgo] }
                  ]
                }
              }
            }
          ],
          as: 'recentMappings'
        }
      },
      {
        $match: {
          'recentMappings.0': { $exists: false } // No mappings in the past 5 minutes
        }
      },
      {
        $sample: { size: 1 } // Get one available virtual number
      }
    ]);

    if (!availableNumber || availableNumber.length === 0) {
      return ErrorEmptyResponse(res, 'No available virtual number.');
    }

    const virtualNumber = availableNumber[0].virtual_number;


    await VIRTUAL_MAPPING.create({
      qrId,
      virtual_number: virtualNumber,
      expiresAt: new Date(now.getTime() + 1 * 60000), // 5 minutes from now
      phone
    });

    return SuccessResponse(res, 'Virtual number assigned successfully', { virtualNumber });
  } catch (error: any) {
    console.error('Error assigning virtual number:', error);
    return ErrorEmptyResponse(res, error.message || 'An error occurred.');
  }
};
