import AWS from 'aws-sdk'
import axios from 'axios'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const s3 = new AWS.S3()
const url = process.env.API_URL
const apiKey = process.env.API_KEY

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${apiKey}`
}

async function getLatestJsonFromS3(bucketName, prefix = 'analysis/') {
  // List all objects in the bucket with the given prefix
  const listParams = {
    Bucket: bucketName,
    Prefix: prefix
  }
  
  const objects = await s3.listObjectsV2(listParams).promise()
  
  if (!objects.Contents || objects.Contents.length === 0) {
    throw new Error('No JSON files found in the bucket')
  }
  
  // Sort objects by LastModified date in descending order (most recent first)
  const sortedObjects = objects.Contents.sort((a, b) => 
    b.LastModified.getTime() - a.LastModified.getTime()
  )
  
  // Get the most recent object
  const latestObject = sortedObjects[0]
  
  // Get the object content
  const getParams = {
    Bucket: bucketName,
    Key: latestObject.Key
  }
  
  const response = await s3.getObject(getParams).promise()
  const jsonContent = response.Body.toString('utf-8')
  return JSON.parse(jsonContent)
}

// Update your generateCreativeArticle function to use the new method
export async function generateCreativeArticle() {
  const bucketName = process.env.S3_BUCKET_NAME
  try {
    const imageData = await getLatestJsonFromS3(bucketName)

    const prompt = `You are a creative writer. Based on the following image analysis data, write a fictional, engaging, and imaginative article or short story inspired by the image or scene. Be whimsical or dramatic—have fun with it. Create a title for that article. If it's a known personality or celebrity, make sure to include their actual name in the storyline!

Image Analysis:
${JSON.stringify(imageData, null, 2)}

Creative Article:
`;

    const payload = {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative and imaginative storyteller." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 700
    }

    const response = await axios.post(url, payload, { headers })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error("Error generating article:", error.message)
    return null
  }
}