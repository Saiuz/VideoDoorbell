import boto3
dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
table = dynamodb.Table('Visitors')


table = dynamodb.create_table(
    TableName='Visitors',
    KeySchema=[
        {
            'AttributeName': 'field',
            'KeyType': 'HASH'  #Partition key
         }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'field',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)

print table.table_status



db_field="visitor"
db_name = "Guest name will be saved here"


response = table.put_item(
   Item={
        'field': db_field,
        'guest': db_name

    }
)

print("PutItem succeeded:")
