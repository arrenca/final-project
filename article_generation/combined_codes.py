import boto3
import json
import openai
import os

from openai import OpenAI
import requests  

# Initialize OpenAI client using the newer SDK format
#client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # or set directly

url = "https://is215-openai.upou.io/v1/chat/completions"

# Use API key provided for IS 215
api_key = "anives-008Q84PdCC"  

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}
def get_json_from_s3(bucket_name, file_key):
    """
    Retrieve a JSON file from an S3 bucket and parse its contents
    """
    try:
        s3_client = boto3.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        json_content = response['Body'].read().decode('utf-8')
        data = json.loads(json_content)
        return data
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def generate_creative_article(image_data):
    """
    Generate a fictional creative article based on image analysis data
    """
    prompt = f"""You are a creative writer. Based on the following image analysis data, write a fictional, engaging, and imaginative article or short story inspired by the scene. Be whimsical or dramatic—have fun with it!

Image Analysis:
{json.dumps(image_data, indent=2)}

Creative Article:
"""

    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a creative and imaginative storyteller."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.9,
        "max_tokens": 700
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        completion = response.json()
        return completion['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error generating article: {str(e)}")
        return None

if __name__ == "__main__":
    bucket_name = "arren-is215-final-project1"
    file_key = "analysis/uploaded_image.json"

    json_data = get_json_from_s3(bucket_name, file_key)

    if json_data:
        print("Successfully retrieved JSON data.")
        article = generate_creative_article(json_data)

        if article:
            print("\n--- Creative Article ---\n")
            print(article)
        else:
            print("Failed to generate creative article.")
    else:
        print("Failed to retrieve JSON data.")
