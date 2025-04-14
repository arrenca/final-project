import dotenv from 'dotenv'
import aws from 'aws-sdk'

dotenv.config()

const region = "ap-southeast-2"
const bucketName = "arren-is215-final-project1"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL() {
  const imageName = "uploaded_image" // <-- Your fixed file name

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}