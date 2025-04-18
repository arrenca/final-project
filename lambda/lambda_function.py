import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

def lambda_handler(event, context):
    # Get the S3 bucket and object key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Call Rekognition to detect labels
    label_response = rekognition.detect_labels(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}},
        MaxLabels=10,
        MinConfidence=70
    )
    
    # Call Rekognition to recognize celebrities
    celebrity_response = rekognition.recognize_celebrities(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    
    # Prepare the output JSON
    output = {
        'image': key,
        'labels': label_response['Labels'],
        'celebrities': []
    }
    
    # Process recognized celebrities
    for celebrity in celebrity_response['CelebrityFaces']:
        output['celebrities'].append({
            'name': celebrity['Name'],
            'confidence': celebrity['MatchConfidence'],
            'url': celebrity.get('Urls', [])
        })
    
    # Write the JSON output to S3
    output_key = f"analysis/{key.split('/')[-1]}.json"
    s3.put_object(
        Bucket=bucket,
        Key=output_key,
        Body=json.dumps(output),
        ContentType='application/json'
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Analysis complete for {key}')
    }
import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

def lambda_handler(event, context):
    # Get the S3 bucket and object key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Call Rekognition to detect labels
    label_response = rekognition.detect_labels(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}},
        MaxLabels=10,
        MinConfidence=70
    )
    
    # Call Rekognition to recognize celebrities
    celebrity_response = rekognition.recognize_celebrities(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    
    # Prepare the output JSON
    output = {
        'image': key,
        'labels': label_response['Labels'],
        'celebrities': []
    }
    
    # Process recognized celebrities
    for celebrity in celebrity_response['CelebrityFaces']:
        output['celebrities'].append({
            'name': celebrity['Name'],
            'confidence': celebrity['MatchConfidence'],
            'url': celebrity.get('Urls', [])
        })
    
    # Write the JSON output to S3
    output_key = f"analysis/{key.split('/')[-1]}.json"
    s3.put_object(
        Bucket=bucket,
        Key=output_key,
        Body=json.dumps(output),
        ContentType='application/json'
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Analysis complete for {key}')
    }
