const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")
const generateBtn = document.querySelector("#generateBtn");

document.querySelector("#generateBtn").addEventListener("click", async () => {
  const res = await fetch("/generateArticle")
  const data = await res.json()

  if (data.article) {
    const container = document.querySelector("#articleContainer")
    container.innerText = data.article
  } else {
    alert("Failed to generate article.")
  }
});

generateBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/generate-article"); // Assumes you have a backend endpoint
    const data = await response.json();

    if (data.article) {
      const articleElement = document.createElement("div");
      articleElement.innerText = data.article;
      document.body.appendChild(articleElement);
    } else {
      alert("Failed to generate article.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

imageForm.addEventListener("submit", async event => {
  event.preventDefault()
  const file = imageInput.files[0]

  // get secure url from our server
  const { url } = await fetch("/s3Url").then(res => res.json())
  console.log(url)

  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: file
  })

  const imageUrl = url.split('?')[0]
  console.log(imageUrl)

  // post requst to my server to store any extra data
  
  
  const img = document.createElement("img")
  img.src = imageUrl
  document.body.appendChild(img)
  console.log("Uploaded successfully")  

})
