import { Schema } from 'mongoose';

const AddressSchema = new Schema(
  {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    brgy: { type: String, trim: true },
    city: { type: String, trim: true },
    province: { type: String, trim: true },
    postalCode: { type: String, trim: true },
  },
  { _id: false },
);

export default AddressSchema;
