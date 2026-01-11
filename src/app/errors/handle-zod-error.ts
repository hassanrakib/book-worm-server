import { ZodError } from "zod";
import { ErrorProcessor, ErrorSources } from "../interfaces/error";
import httpStatus from "http-status";

const handleZodError: ErrorProcessor<ZodError> = (err) => {
  const errorSources: ErrorSources = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "ZodError",
    errorSources,
  };
};

export default handleZodError;
