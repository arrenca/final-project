import dotenv from 'dotenv'
import aws from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const region = process.env.AWS_REGION
const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL(fileType) {
  const randomFileName = uuidv4(); // No extension added

  const params = {
    Bucket: bucketName,
    Key: randomFileName,
    Expires: 60,
    ContentType: fileType
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}