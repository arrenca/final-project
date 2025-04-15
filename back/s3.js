import dotenv from 'dotenv'
import aws from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

dotenv.config()

const region = "ap-southeast-2" // <-- Change to the correct AWS region
const bucketName = "arren-is215-final-project1" // <-- Change to the correct bucket name
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL(fileType) {
  const fileExtension = mime.extension(fileType) || 'bin';
  const randomFileName = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: bucketName,
    Key: randomFileName,
    Expires: 60,
    ContentType: fileType
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}