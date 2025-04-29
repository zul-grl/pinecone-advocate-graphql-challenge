import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true, index: true },
  description: { type: String, required: true, minlength: 10 },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, required: true, min: 1, max: 5 },
  tags: {
    type: [String],
    validate: {
      validator: function (tags: string[]) {
        return tags.length <= 5;
      },
    },
  },
  userId: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
taskSchema.index({ taskName: 1, userId: 1 }, { unique: true });

taskSchema.pre("save", function (next) {
  if (this.description === this.taskName) {
    throw new Error("Description cannot be the same as task name");
  }
  next();
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
