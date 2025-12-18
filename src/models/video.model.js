import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      default: "",
      required: true,
    },
    thumnail: {
      type: String,
      default: "",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPulished: {
      type: Boolean,
      default: true,
    },
    uplodedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
