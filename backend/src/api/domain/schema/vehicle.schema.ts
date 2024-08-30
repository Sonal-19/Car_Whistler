import { ref, string } from "yup";

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
    otp: {
      type: String,
      unique: true,
    },
    otpExpireTime: {
      type: Date,
    },
    userToken: {
      type: String,
      default: undefined,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetOTP: {
      type: String,
      default: undefined,
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const ADDRESS_DETAIL = mongoose.model(
  "address_detail",
  new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
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
      type: String,
      required: true,
      unique: true,
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

export const VEHICLE_DETAIL = mongoose.model(
  "vehicle_details",
  new Schema({
    userId: {
      type: String,
      required: true,
    },
    qrId: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
    },
    state_code: {
      type: String,
    },
    state: {
      type: String,
    },
    office_code: {
      type: Number,
    },
    office_name: {
      type: String,
    },
    reg_no: {
      type: String,
      required: true,
      unique: true,
    },
    reg_date: {
      type: Date,
    },
    purchase_date: {
      type: Date,
    },
    owner_count: {
      type: Number,
    },
    owner_name: {
      type: String,
    },
    owner_father_name: {
      type: String,
    },
    current_address_line1: {
      type: String,
    },
    current_address_line2: {
      type: String,
    },
    current_address_line3: {
      type: String,
    },
    current_district_name: {
      type: String,
    },
    current_state: {
      type: String,
    },
    current_state_name: {
      type: String,
    },
    current_pincode: {
      type: Number,
    },
    permanent_address_line1: {
      type: String,
    },
    permanent_address_line2: {
      type: String,
    },
    permanent_address_line3: {
      type: String,
    },
    permanent_district_name: {
      type: String,
    },
    permanent_state: {
      type: String,
    },
    permanent_state_name: {
      type: String,
    },
    permanent_pincode: {
      type: Number,
    },
    owner_code_descr: {
      type: String,
    },
    reg_type_descr: {
      type: String,
    },
    vehicle_class_desc: {
      type: String,
    },
    chassis_no: {
      type: String,
    },
    engine_no: {
      type: String,
    },
    vehicle_manufacturer_name: {
      type: String,
    },
    model_code: {
      type: String,
    },
    model: {
      type: String,
    },
    body_type: {
      type: String,
    },
    cylinders_no: {
      type: Number,
    },
    vehicle_hp: {
      type: Number,
    },
    vehicle_seat_capacity: {
      type: Number,
    },
    vehicle_standing_capacity: {
      type: Number,
    },
    vehicle_sleeper_capacity: {
      type: Number,
    },
    unladen_weight: {
      type: Number,
    },
    vehicle_gross_weight: {
      type: Number,
    },
    vehicle_gross_comb_weight: {
      type: Number,
    },
    fuel_descr: {
      type: String,
    },
    color: {
      type: String,
    },
    manufacturing_mon: {
      type: Number,
    },
    manufacturing_yr: {
      type: Number,
    },
    norms_descr: {
      type: String,
    },
    wheelbase: {
      type: Number,
    },
    cubic_cap: {
      type: Number,
    },
    floor_area: {
      type: Number,
    },
    ac_fitted: {
      type: String,
    },
    audio_fitted: {
      type: String,
    },
    video_fitted: {
      type: String,
    },
    vehicle_purchase_as: {
      type: String,
    },
    vehicle_catg: {
      type: String,
    },
    dealer_code: {
      type: String,
    },
    dealer_name: {
      type: String,
    },
    dealer_address_line1: {
      type: String,
    },
    dealer_address_line2: {
      type: String,
    },
    dealer_address_line3: {
      type: String,
    },
    dealer_district: {
      type: String,
    },
    dealer_pincode: {
      type: String,
    },
    sale_amount: {
      type: Number,
    },
    laser_code: {
      type: String,
    },
    garage_add: {
      type: String,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    reg_upto: {
      type: Date,
    },
    fit_upto: {
      type: Date,
    },
    annual_income: {
      type: Number,
    },
    op_dt: {
      type: Date,
    },
    imported_vehicle: {
      type: String,
    },
    other_criteria: {
      type: Number,
    },
    status: {
      type: String,
    },
    vehicle_type: {
      type: String,
    },
    tax_mode: {
      type: String,
    },
    mobile_no: {
      type: Number,
    },
    email_id: {
      type: String,
    },
    pan_no: {
      type: String,
    },
    aadhar_no: {
      type: String,
    },
    passport_no: {
      type: String,
    },
    ration_card_no: {
      type: String,
    },
    voter_id: {
      type: String,
    },
    dl_no: {
      type: String,
    },
    verified_on: {
      type: Date,
    },
    dl_validation_required: {
      type: Boolean,
    },
    condition_status: {
      type: Boolean,
    },
    vehicle_insurance_details: {
      insurance_from: {
        type: Date,
      },
      insurance_upto: {
        type: Date,
      },
      insurance_company_code: {
        type: Number,
      },
      insurance_company_name: {
        type: String,
      },
      opdt: {
        type: Date,
      },
      policy_no: {
        type: String,
      },
      vahan_verify: {
        type: String,
      },
      reg_no: {
        type: String,
      },
    },
    vehicle_pucc_details: {
      pucc_from: {
        type: Date,
      },
      pucc_upto: {
        type: Date,
      },
      pucc_centreno: {
        type: String,
      },
      pucc_no: {
        type: String,
      },
      op_dt: {
        type: Date,
      },
    },
    permit_details: {
      appl_no: {
        type: String,
      },
      pmt_no: {
        type: String,
      },
      reg_no: {
        type: String,
      },
      rcpt_no: {
        type: String,
      },
      purpose: {
        type: String,
      },
      permit_type: {
        type: String,
      },
      permit_catg: {
        type: String,
      },
      permit_issued_on: {
        type: Date,
      },
      permit_valid_from: {
        type: Date,
      },
      permit_valid_upto: {
        type: Date,
      },
    },
    latest_tax_details: {
      reg_no: {
        type: String,
      },
      tax_mode: {
        type: String,
      },
      payment_mode: {
        type: String,
      },
      tax_amt: {
        type: Number,
      },
      tax_fine: {
        type: Number,
      },
      rcpt_dt: {
        type: Date,
      },
      tax_from: {
        type: Date,
      },
      tax_upto: {
        type: Schema.Types.Mixed,
      },
      collected_by: {
        type: String,
      },
      rcpt_no: {
        type: String,
      },
    },
    financer_details: {
      hp_type: {
        type: String,
      },
      financer_name: {
        type: String,
      },
      financer_address_line1: {
        type: String,
      },
      financer_address_line2: {
        type: String,
      },
      financer_address_line3: {
        type: String,
      },
      financer_district: {
        type: Number,
      },
      financer_pincode: {
        type: Number,
      },
      financer_state: {
        type: String,
      },
      hypothecation_dt: {
        type: Date,
      },
      op_dt: {
        type: Date,
      },
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const DELIVERY_CHARGES = mongoose.model(
  "delivery_charges",
  new Schema({
    pincode: {
      type: String,
      required: true,
      unique: true
    },
    delivery_charge: {
      type: Number,
      required: true
    },
  })
);

export const PAYMENT_CAR_WHISTLER = mongoose.model(
  "payment_car_whistler",
  new Schema({
    transitionId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle_details",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address_detail",
      required: true,
    },
    addressDetail: {
      type: Map,
      of: String,
      default: {}
    },
    sticker_charge: {
      type: Number,
      default: 0,
    },
    delivery_charge: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    payment_by: {
      type: String,
      default: "Car Whistler",
    },
    orderId: {
      type: String,
      default: ''
    },
    paymentMode: {
      type: String,
      default: ''
    },
    paymentStatus: {
      type: String,
      default: ''
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const CART = mongoose.model(
  "cart",
  new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle_details",
      required: true,
    },
    insertDateTime: {
      type: String,
      required: true,
    },
  })
);

export const VIRTUAL_NUMBERS = mongoose.model(
  "virtual_numbers",
  new Schema({
    virtual_number: {
      type: String,
      required: true
    }
  })
);

export const VIRTUAL_MAPPING = mongoose.model(
  "virtual_mapping",
  new Schema({
    qrId: {
      type: String,
      required: true
    },
    virtual_number: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date
    },
    phone: {
      type: String
    }
  })
);