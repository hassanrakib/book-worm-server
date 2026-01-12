import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import AppError from "../errors/app-error";
import httpStatus from "http-status";
import path from "path";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  //   secure_distribution: 'mydomain.com',
});

const generateFileName = (file: Express.Multer.File) => {
  const { name, ext } = path.parse(file.originalname);

  const sanitizedName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;

  return `${sanitizedName || 'file'}-${uniqueSuffix}${ext.toLowerCase()}`;
};

const saveImageToCloud = async (file: Express.Multer.File) => {
  try {

    const imageName = generateFileName(file);

    const { secure_url } = await cloudinary.uploader.upload(file.path, {
      // folder in cloudinary
      folder: 'book-worm/assets/images',
      // image name in cloudinary
      public_id: imageName,
    });
    return secure_url;
  } catch (err: unknown) {
    console.log('Error file upload to cloudinary', err);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, (err as Error).message);
  }
};

export default saveImageToCloud;
