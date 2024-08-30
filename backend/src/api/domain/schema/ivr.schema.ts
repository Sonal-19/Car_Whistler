var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const REGISTER = mongoose.model(
  "users",
  new Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    userToken: {
      type: String,
      default: undefined,
    },
    otp:{
      type: String,
      default: undefined,
    },
    verified: {
      type:Boolean,
      default:false,
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const VEHICLE_DETAIL = mongoose.model(
  "vehicle_details",
  new Schema({
    userId: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const QR_CODE = mongoose.model(
  "qr_codes",
  new Schema({
    qrId: {
      type: Number,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const DELIVERY_CHARGES_ESTIMATE = mongoose.model(
  "delivery_charges_estimation",
  new Schema(
    {
      pin_code: {
        required: true,
        type: String,
      },
    },
    {
      collection: "delivery_charges_estimation",
    }
  )
);
