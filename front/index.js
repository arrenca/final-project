const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");
const articleContainer = document.querySelector("#articleContainer");
let uploadedImageUrl = ""; // Store image URL for context if needed later

imageForm.addEventListener("submit", async event => {
  event.preventDefault();
  const file = imageInput.files[0];

  // get secure url from our server
  const { url } = await fetch("/s3Url").then(res => res.json());
  console.log(url);

  // post the image directly to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: file
  });

  // Get the clean image URL
  uploadedImageUrl = url.split('?')[0];

  // Clear previous content
  articleContainer.innerHTML = "";

  // Display the image
  const img = document.createElement("img");
  img.src = uploadedImageUrl;
  img.alt = "Uploaded image";
  img.style.maxWidth = "100%";
  img.style.display = "block";
  img.style.marginTop = "20px";

  articleContainer.appendChild(img);
  console.log("Uploaded successfully");
});

document.querySelector("#generateBtn").addEventListener("click", async () => {
  const res = await fetch("/generateArticle");
  const data = await res.json();

  if (data.article) {
    const [title, ...bodyParts] = data.article.trim().split(/\n+/);
    const body = bodyParts.join("\n\n");
  
    // Create and style the header
    const header = document.createElement("h2");
    header.textContent = title;
    header.style.marginTop = "30px";
    header.style.fontFamily = "Georgia, serif";
    header.style.fontSize = "1.6em";
    header.style.fontWeight = "bold";
  
    // Create and style the article body
    const article = document.createElement("p");
    article.textContent = body;
    article.style.marginTop = "15px";
    article.style.fontFamily = "Georgia, serif";
    article.style.fontSize = "1.1em";
    article.style.lineHeight = "1.6";
  
    articleContainer.appendChild(header);
    articleContainer.appendChild(article);
  } else {
    alert("Failed to generate article.");
  }
});