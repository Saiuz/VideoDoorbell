# VideoDoorbell
A video doorbell using a RasPi camera, an IoT button and Alexa to determine guests and strangers using facial recognition


Video Doorbell using AWS services

AWS Dash button

Select AWS IoT service from the list of AWS services.
Create Thing í Create a Single thing í
Enter a name for your IoT device 
E.g.: AWS Dash button

Create certificate
Download the certificates (to connect to this device) to your system
1. Certificate for this thing
2. Public key
3. Private key
4. Root-CA

Activate certificate

Attach a Policy
Attach AWSDashButtonPolicy

Register Thing

Click on your thing from the list of things i.e. AWS Dash Button
Select Security
Click on your certificate(the one you downloaded)
Select Policies
Check if AWSDashButtonPolicy is attached or Create a policy as below:


{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:us-east-1:164336801877:topic/iotbutton/G030MD044215SSU3"
    }
  ]
}


where resource ARN is the device ARN ID  followed by a topic name which the device will be listening on
in above case the device topic is the Dash button ID 
topic/iotbutton/G030MD044215SSU3"

Click on Test in the AWS IoT console
Subscribe to a topic, in this case it is iotbutton/G030MD044215SSU3
Click the Dash button once you should see the JSON generated in the box below

//Create a Rule
//Enter a name eg: ClickPicture
//Provide a description : Dash button click Calls Raspi Camera to click image
//Attribute name: clickType for now( to determine what kinda click has been made on the dash //button í SINGLE, DOUBLE, LONG)
//Topic Name is as set above in this case iotbutton/G030MD044215SSU3


Connect the RaspberryPi to a monitor and a power source.
TODO:
Run a script that starts the code on booting RaspberryPi

Create a new python file and paste the code from the RaspberryPi folder on Git

Move the downloaded certificates to the RaspberryPi system
You can do this using scp command. The code requires the right location of these certificates.

The code creates a MQTT client to interact with the Dash button. 
The code subscribes to the same topic as the Dash button and that's how the devices communicate. 
The code also captures an image on the Raspi and runs it against the Facial Recognition to check if the user is in the database. 
Message is displayed appropriately.
TODO: Handle try catch error 

Alexa Skill
Run the CreateTable.py to create a table in dynamodb where the visitor name will be saved to a field.

Create a lambda function for the Alexa skill. Save the ARN number of the lambda.
Add a trigger as Alexa Skills Kit

Copy the VideoDoorbell.js from Git and add it to your lambda function
Save.

Log in to AWS developer console and click the Alexa tab.
Select Alexa Skills kit.
Add a new skill
Give a name and an invocation_Name. Leave Global fields to "NO". Click Next
Add an intent from the panel on the left
Add sample utterances that people might say to invoke your skill.
E.g.: "Who is at the door", "Who's at the door", "Get the door" …etc

Select the Configuration tab above
Select Endpoint as AWS Lambda and paste the ARN from above lambda that you just created in this case being VideoDoorBell.js
Select Geographical region as  North America
Click Next
Under service simulator enter utterance in this case "Who's at the door"
Watch magic unfold




