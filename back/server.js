import express from 'express'
import { generateUploadURL } from './s3.js'
import { generateCreativeArticle } from '../front/generate_article.js'

const app = express()
app.use(express.static('front'))

app.get('/s3Url', async (req, res) => {
  const url = await generateUploadURL()
  res.send({ url })
})

app.get('/generateArticle', async (req, res) => {
  const article = await generateCreativeArticle()
  if (article) {
    res.send({ article })
  } else {
    res.status(500).send({ error: "Failed to generate article" })
  }
})

app.listen(80, () => console.log("listening on port 80"))
