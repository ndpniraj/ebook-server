import { Model, ObjectId, Schema, model } from "mongoose";

interface HistoryDoc {
  book: ObjectId;
  reader: ObjectId;
  lastLocation: string;
  highlights: { selection: string; fill: string }[];
}

const historySchema = new Schema<HistoryDoc>(
  {
    book: {
      type: Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    reader: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    lastLocation: String,
    highlights: [{ selection: String, fill: String }],
  },
  {
    timestamps: true,
  }
);

const HistoryModel = model("History", historySchema);

export default HistoryModel as Model<HistoryDoc>;
