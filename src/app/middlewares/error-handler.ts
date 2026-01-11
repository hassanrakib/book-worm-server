import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { Error11000, ErrorResponse } from "../interfaces/error";
import config from "../config";
import AppError from "../errors/app-error";
import { ZodError } from "zod";
import handleZodError from "../errors/handle-zod-error";
import { Error, mongo } from "mongoose";
import handleValidationError from "../errors/handle-validation-error";
import handleCastError from "../errors/handle-cast-error";
import handleDuplicateValueError from "../errors/handle-duplicate-value-error";
import { MulterError } from "multer";
import handleMulterError from "../errors/handle-file-upload-error";
import { deleteMulterUploadedFiles } from "../utils/uploaded-files";

const errorHandler =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (): ErrorRequestHandler => (err: unknown, req, res, next) => {
    // default error response
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong",
      errorSources: [{ path: "", message: "Something went wrong" }],
      stack: config.NODE_ENV === "development" ? (err as Error).stack! : null,
    };

    if (err instanceof ZodError) {
      const generalizedError = handleZodError(err);

      errorResponse.statusCode = generalizedError.statusCode;
      errorResponse.message = generalizedError.message;
      errorResponse.errorSources = generalizedError.errorSources;
    } else if (err instanceof Error.ValidationError) {
      const generalizedError = handleValidationError(err);

      errorResponse.statusCode = generalizedError.statusCode;
      errorResponse.message = generalizedError.message;
      errorResponse.errorSources = generalizedError.errorSources;
    } else if (err instanceof Error.CastError) {
      const generalizedError = handleCastError(err);

      errorResponse.statusCode = generalizedError.statusCode;
      errorResponse.message = generalizedError.message;
      errorResponse.errorSources = generalizedError.errorSources;
    } else if (err instanceof mongo.MongoServerError && err.code === 11000) {
      const generalizedError = handleDuplicateValueError(err as Error11000);

      errorResponse.statusCode = generalizedError.statusCode;
      errorResponse.message = generalizedError.message;
      errorResponse.errorSources = generalizedError.errorSources;
    } else if (err instanceof MulterError) {
      const generalizedError = handleMulterError(err);

      errorResponse.statusCode = generalizedError.statusCode;
      errorResponse.message = generalizedError.message;
      errorResponse.errorSources = generalizedError.errorSources;
    } else if (err instanceof AppError) {
      errorResponse.statusCode = err.statusCode;
      errorResponse.message = err.message;
      errorResponse.errorSources = [
        {
          path: "",
          message: err.message,
        },
      ];
    } else if (err instanceof Error) {
      errorResponse.message = err.message;
      errorResponse.errorSources = [
        {
          path: "",
          message: err.message,
        },
      ];
    }

    // Cleanup files if they exist on the request object
    if (req.files) {
      deleteMulterUploadedFiles(req);
    }

    res.status(errorResponse.statusCode).json(errorResponse);
  };

export default errorHandler;
