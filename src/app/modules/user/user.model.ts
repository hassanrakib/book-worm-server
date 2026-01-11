import { model, Schema } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import { USER_ROLE } from "./user.constant";
import bcrypt from "bcrypt";
import config from "../../config";
import { isStrongPassword } from "validator";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    profilePhoto: {
      type: String,
      required: [true, "Profile photo is required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // Regular expression for basic email validation
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      validate: {
        validator: (password: string) => isStrongPassword(password),
        message: "Password must be strong",
      },
      // omit password field in the query result
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: "{VALUE} is not a supported role",
      },
      required: [true, "User role is required"],
    },
  },
  {
    timestamps: true,
  }
);

// pre & post save middlewares for user

// hash the password before storing into db
userSchema.pre("save", async function () {
  // If the password field hasn't changed, exit immediately
  if (!this.isModified("password")) {
    return;
  }

  // Only runs if it's a new password or an update to the password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
});

// make the password field empty for after save response
userSchema.post("save", function (doc) {
  doc.password = "";
});

// user instance methods
userSchema.methods.isPasswordMatch = async function (
  plainTextPassword: string
) {
  // 'this' referes to the user doc & doc.password is a hashed password
  return bcrypt.compare(plainTextPassword, this.password);
};

// static method
userSchema.statics.getUserByEmail = async function (
  email: string,
  selectPassword = false
) {
  // Start the query chain
  const query = this.findOne({ email });

  // If password is explicitly requested, add it to the selection
  if (selectPassword) {
    query.select("+password");
  }

  return await query;
};

export const User = model<IUser, UserModel>("User", userSchema);
