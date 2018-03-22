from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import picamera
import json
import boto3
import re


host='a2i24z1epaqm0b.iot.us-east-1.amazonaws.com'
rootCAPath='/home/pi/root-CA.crt'
privateKeyPath='/home/pi/RPiCamera.private.key'
certificatePath='/home/pi/RPiCamera.cert.pem'
topic='iotbutton/G030MD044215SSU3'
pathToSaveImage='/home/pi/'
##iotbutton/G030MD044215SSU3    basicPubSub


# Custom MQTT message callback
def customCallback(client, userdata, message):
    print("Received click")
##    print(message.payload)
##    print("from topic: ")
##    print(message.topic)

    messageToJson= json.loads(message.payload)
    clickType= messageToJson['clickType']
    

    if clickType == 'SINGLE':
        fileName=pathToSaveImage + 'latest.png'
        takePicture(fileName)
        checkFace(fileName)
    elif clickType == 'DOUBLE':
        name=raw_input('Hi! What\'s your name?\n')
        fileName=pathToSaveImage + name + '.png'              
        takePicture(fileName)
        with open(fileName,'rb') as image:
            imageAsBytes=image.read()
        addToCollection(name,imageAsBytes)
    
    
    
def addToCollection(name,imageAsBytes):
    name=name.replace(' ','')
##    print name
    client=boto3.client('rekognition','us-east-1')
    s3= boto3.resource('s3','us-east-1')
    image_bucket=s3.Bucket('facialrecog-nyl')
    response= client.index_faces(
        CollectionId='testColl',
        Image={
            'Bytes': imageAsBytes
##            'S3Object':{
##                'Bucket':'facialrecog-nyl',
##                'Name': name+'.png',
##                }
            },
        ExternalImageId=name
    )
                       
    print "You have beed added to our Database!"


def takePicture(fileName):
    camera = picamera.PiCamera()
    camera.resolution = (1920, 1080)
    camera.preview_fullscreen=False
    camera.preview_window=(620, 320, 640, 480)
##    camera.vflip = True
    camera.start_preview()
    time.sleep(3)
    camera.capture(fileName)
    camera.stop_preview()
    camera.close()


def checkFace(fileName):
    client=boto3.client('rekognition','us-east-1')
    with open(fileName,'rb') as image:
        bytes=image.read()
    response= client.search_faces_by_image(
        CollectionId='testColl',
        Image={
            'Bytes': bytes
        }
    ) 

    print response
    
    if response['FaceMatches']:
        visitorName=response['FaceMatches'][0]['Face']['ExternalImageId']
        visitorName=re.sub(r"(?<=\w)([A-Z])",r" \1",visitorName)
        print 'Match Found for '+visitorName+'!!'

        dynamodb=boto3.resource("dynamodb",region_name='us-east-1')
        table=dynamodb.Table('Visitors')
         response= table.update_item(
            Key={
                'field':'visitor'
                },
            UpdateExpression="set guest = :r",
            ExpressionAttributeValues={
                ':r':visitorName,
                },
            ReturnValues="UPDATED_NEW"
            )
    else:
        print 'Intruder Alert!! --> link to Alexa'

    #write to Dynamodb
            
        
        



# Init AWSIoTMQTTClient
myAWSIoTMQTTClient = None    
myAWSIoTMQTTClient = AWSIoTMQTTClient("basicPubSub")
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(30)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(20)  # 5 sec

#print topic

# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect()
myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
 
time.sleep(2)
##myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
##time.sleep(2)

# Publish to the same topic in a loop forever
##loopCount = 0
##while True:
##    myAWSIoTMQTTClient.publish(topic, "New Message " + str(loopCount), 1)
##    loopCount += 1
##    time.sleep(1)


