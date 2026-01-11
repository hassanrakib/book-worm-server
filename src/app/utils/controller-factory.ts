import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "./catch-async";
import {
  deleteMulterUploadedFiles,
  getMulterUploadedFile,
  getMulterUploadedFiles,
} from "./uploaded-files";
import sendResponse from "./send-response";
import AppError from "../errors/app-error";
import { IRequestUser } from "../interfaces";

/**
 * Standard shape of data extracted from request
 */
export interface ControllerContext<
  TParams = unknown,
  TBody = unknown,
  TQuery = unknown,
  TFile = unknown,
  TFiles = unknown
> {
  params: TParams;
  body: TBody;
  query: TQuery;
  file: TFile;
  files: TFiles;
  user: IRequestUser;
  req: Request;
}

/**
 * Factory configuration
 */
export interface ControllerFactoryConfig<
  TParams = unknown,
  TBody = unknown,
  TQuery = unknown,
  TFile = unknown,
  TFiles = unknown,
  TResult = unknown
> {
  useFile?: { required?: string };
  useFiles?: { required?: string };
  successMessage: string;
  successStatusCode?: number;

  /**
   * Throw an error when the service returns `null`,
   * typically used for read/update/delete operations by id.
   */
  notFound?: {
    statusCode?: number;
    message?: string;
  };

  service: (
    ctx: ControllerContext<TParams, TBody, TQuery, TFile, TFiles>
  ) => Promise<TResult>;
}

export const makeController = <
  TParams = unknown,
  TBody = unknown,
  TQuery = unknown,
  TFile = unknown,
  TFiles = unknown,
  TResult = unknown
>(
  config: ControllerFactoryConfig<
    TParams,
    TBody,
    TQuery,
    TFile,
    TFiles,
    TResult
  >
) =>
  catchAsync(async (req: Request, res: Response) => {
    /**
     *
     * Get multer uploaded file / files
     * Also throw error if file / files is made required by makeController config
     */
    const file = config.useFile ? getMulterUploadedFile(req) : undefined;

    const files = config.useFiles ? getMulterUploadedFiles(req) : undefined;

    if (config.useFile?.required && !file) {
      throw new AppError(httpStatus.BAD_REQUEST, config.useFile.required);
    }

    if (config.useFiles?.required && (!files || files.length === 0)) {
      throw new AppError(httpStatus.BAD_REQUEST, config.useFiles.required);
    }

    /**
     * call the service function
     */

    const result = await config.service({
      params: req.params as TParams,
      body: req.body as TBody,
      query: req.query as TQuery,
      file: file as TFile,
      files: files as TFiles,
      user: req.user ?? ({} as IRequestUser),
      req,
    });

    /**
     * Handle "not found" case when the service returns null
     * and the controller opts into notFound behavior.
     */
    if (result === null && config.notFound) {
      throw new AppError(
        config.notFound.statusCode ?? httpStatus.NOT_FOUND,
        config.notFound.message ?? "Resource not found"
      );
    }

    /**
     * cleanup disk storage after successful operations
     */
    if (config.useFile || config.useFiles) {
      deleteMulterUploadedFiles(req);
    }

    sendResponse(res, {
      success: true,
      statusCode: config.successStatusCode ?? httpStatus.OK,
      message: config.successMessage,
      data: result,
    });
  });
