import AWS from 'aws-sdk'
import axios from 'axios'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const s3 = new AWS.S3()
const url = "https://is215-openai.upou.io/v1/chat/completions"
const apiKey = process.env.API_KEY

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${apiKey}`
}

async function getJsonFromS3(bucketName, fileKey) {
  const params = { Bucket: bucketName, Key: fileKey }
  const response = await s3.getObject(params).promise()
  const jsonContent = response.Body.toString('utf-8')
  return JSON.parse(jsonContent)
}

export async function generateCreativeArticle() {
  const bucketName = "arren-is215-final-project1" // <-- Change to the correct bucket name
  const fileKey = "analysis/uploaded_image.json" // <-- Change to the correct file key
  try {
    const imageData = await getJsonFromS3(bucketName, fileKey)

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