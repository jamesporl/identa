import { model, Schema, Types } from 'mongoose';
import { Visit } from './_types';

const VisitSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true },
    clinicId: { type: Types.ObjectId, required: true },
    accountId: { type: Types.ObjectId, required: true },
    patientId: { type: Types.ObjectId, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    reason: { type: String },
    createdById: { type: Types.ObjectId },
    updatedById: { type: Types.ObjectId },
  },
  { collection: 'Visit', timestamps: true },
);

VisitSchema.index({
  companyId: 1, clinicId: 1, startAt: 1, endAt: 1,
});

const MVisit = model<Visit>('Visit', VisitSchema);

export default MVisit;
