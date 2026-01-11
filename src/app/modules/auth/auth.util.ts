import jwt, { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";
import { TJwtPayload, ITokenSignPayload } from "./auth.interface";
import AppError from "../../errors/app-error";

export const signJwtToken = (
  payload: ITokenSignPayload,
  expiresIn: SignOptions["expiresIn"]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if secret exists before signing
    if (!config.jwt_secret) {
      reject(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "JWT Secret is not defined"
        )
      );
      return;
    }

    jwt.sign(payload, config.jwt_secret, { expiresIn }, function (err, token) {
      if (err) {
        reject(
          new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to generate authentication token"
          )
        );
      } else {
        resolve(token!);
      }
    });
  });
};

export const verifyJwtToken = (token: string): Promise<TJwtPayload> => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(
        new AppError(httpStatus.UNAUTHORIZED, "Authorization token is missing")
      );

      return;
    }

    // Check if secret exists before verifying
    if (!config.jwt_secret) {
      reject(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "JWT Secret is not defined"
        )
      );
      return;
    }

    jwt.verify(token, config.jwt_secret, function (err, decoded) {
      if (err) {
        // differentiate between Expired and Invalid if needed
        const message =
          err.name === "TokenExpiredError"
            ? "Token expired. Please login again."
            : "Invalid token. Please login again.";

        reject(new AppError(httpStatus.UNAUTHORIZED, message));
      } else {
        resolve(decoded as TJwtPayload);
      }
    });
  });
};
