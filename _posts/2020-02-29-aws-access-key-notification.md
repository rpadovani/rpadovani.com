---
layout: post
title:  "Leveraging AWS Lambda to notify users about their old access keys"
date:   2020-02-29 19:00
description: "Rotating AWS Access Keys is an important measure to protect your AWS Account - how to remind everyone to do so?"
categories:
- aws
permalink: aws-lambda-access-key-notifications
---
 
I love to spend time trying to automatize out boring part of my job. One of these boring side is remembering people to 
rotate AWS Access Keys, as suggested also by AWS in [their best practices][best-practices]. 

The AWS IAM console helps highlighting which keys are old, but if you have dozens of users, or multiple AWS accounts, 
it is still boring doing it by hand. So, I wrote some code to doing it automatically leveraging AWS Lambda - since it has
a generous free-tier, this check is free (however, your mileage may vary).

![automation - xkcd][img-automation]
<small>Image by Randall Munroe, [xkcd.com][automation]</small>

# Setting up the permissions

Of course, we want to follow the [principle of least privilege][least-privilege]: the Lambda function will have access
only to the minimum data necessary to perform its task. Thus, we need to create a dedicated role over the IAM Console.
<small>[AWS Guide][iam-create-role] to create roles for AWS services</small>

Our custom role needs to have the managed policy `AWSLambdaBasicExecutionRole`, needed to execute a Lambda function.
Other than this, we create a custom inline policy with this permissions:

- `iam:ListUsers`, to know which users have access to the account. If you want to check only a subset of users, like
filtering by department, you can use the `Resource` field to limit the access.
- `iam:ListAccessKeys`, to read access keys of the users. Of course, you can limit here as well which users the Lambda
has access to.
- `ses:SendEmail`, to send the notification emails. Once again, you can (and should!) restrict the ARN to which it has
access to.

And that are all the permissions we need!

The generated policy should look like this, more or less:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "iam:ListAccessKeys"
            ],
            "Resource": [
                "arn:aws:iam::<ACCOUNT_ID>:user/*",
                "arn:aws:ses:eu-central-1:<ACCOUNT_ID>:identity/*"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "iam:ListUsers",
            "Resource": "*"
        }
    ]
}
```

# Setting up SES

To send the notification email we use AWS Simple Email Service.

Before using it, you need to move out of the [sandbox mode][sandbox], or to [verify domains][verify-domains] you want to send emails to.
<small>If all your users have emails from the same domain, and you have access to the DNS, probably is faster to just verify your domain,
especially if the AWS account is quite new.</small>

After that, you don't have to do anything else, SES will be used by the Lambda code.

# Setting up Lambda

You can now create an AWS Lambda function. I've written the code that you find below in Python, since I find it is the
fastest way to put in production a so simple script. However, you can use any of the supported languages.
<small>If you have never used AWS Lambda before, you can start [from here][lambda-start]</small>

You need to assign the role we created before as execution role. As memory, 128MB is more than enough. 
About the timeout, it's up to how big is your company. More or less, it is able to check 5/10 users every second. 
You should test it and see if it goes in timeout.

# Lambda Code

Following there is the code to perform the task. To read it better, you can find it also on this [Gitlab's snippet][snippet].

```python3
from collections import defaultdict
from datetime import datetime, timezone
import logging

import boto3
from botocore.exceptions import ClientError


# How many days before sending alerts about the key age?
ALERT_AFTER_N_DAYS = 100
# How ofter we have set the cron to run the Lambda?
SEND_EVERY_N_DAYS = 3
# Who send the email?
SES_SENDER_EMAIL_ADDRESS = 'example@example.com'
# Where did we setup SES?
SES_REGION_NAME = 'eu-west-1'

iam_client = boto3.client('iam')
ses_client = boto3.client('ses', region_name=SES_REGION_NAME)

# Helper function to choose if a key owner should be notified today
def is_key_interesting(key):
    # If the key is inactive, it is not interesting
    if key['Status'] != 'Active':
        return False
    
    elapsed_days = (datetime.now(timezone.utc) - key['CreateDate']).days
    
    # If the key is newer than ALERT_AFTER_N_DAYS, we don't need to notify the
    # owner
    if elapsed_days < ALERT_AFTER_N_DAYS:
        return False
    
    return True
    
# Helper to send the notification to the user. We need the receiver email, 
# the keys we want to notify the user about, and on which account we are
def send_notification(email, keys, account_id):
    email_text = f'''Dear {keys[0]['UserName']},
this is an automatic reminder to rotate your AWS Access Keys at least every {ALERT_AFTER_N_DAYS} days.

At the moment, you have {len(keys)} key(s) on the account {account_id} that have been created more than {ALERT_AFTER_N_DAYS} days ago:
'''
    for key in keys:
        email_text += f"- {key['AccessKeyId']} was created on {key['CreateDate']} ({(datetime.now(timezone.utc) - key['CreateDate']).days} days ago)\n"
    
    email_text += f"""
To learn how to rotate your AWS Access Key, please read the official guide at https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_RotateAccessKey
If you have any question, please don't hesitate to contact the Support Team at support@example.com.

This automatic reminder will be sent again in {SEND_EVERY_N_DAYS} days, if the key(s) will not be rotated.

Regards,
Your lovely Support Team
"""
    
    try:
        ses_response = ses_client.send_email(
            Destination={'ToAddresses': [email]},
            Message={
                'Body': {'Html': {'Charset': 'UTF-8', 'Data': email_text}},
                'Subject': {'Charset': 'UTF-8',
                            'Data': f'Remember to rotate your AWS Keys on account {account_id}!'}
            },
            Source=SES_SENDER_EMAIL_ADDRESS
        )
    except ClientError as e:
        logging.error(e.response['Error']['Message'])
    else:
        logging.info(f'Notification email sent successfully to {email}! Message ID: {ses_response["MessageId"]}')

def lambda_handler(event, context):
    users = []
    is_truncated = True
    marker = None
    
    # We retrieve all users associated to the AWS Account.  
    # Results are paginated, so we go on until we have them all
    while is_truncated:
        # This strange syntax is here because `list_users` doesn't accept an 
        # invalid Marker argument, so we specify it only if it is not None
        response = iam_client.list_users(**{k: v for k, v in (dict(Marker=marker)).items() if v is not None})
        users.extend(response['Users'])
        is_truncated = response['IsTruncated']
        marker = response.get('Marker', None)
    
    # Probably in this list you have bots, or users you want to filter out
    # You can filter them by associated tags, or as I do here, just filter out 
    # all the accounts that haven't logged in the web console at least once
    # (probably they aren't users)
    filtered_users = list(filter(lambda u: u.get('PasswordLastUsed'), users))
    
    interesting_keys = []
    
    # For every user, we want to retrieve the related access keys
    for user in filtered_users:
        response = iam_client.list_access_keys(UserName=user['UserName'])
        access_keys = response['AccessKeyMetadata']
        
        # We are interested only in Active keys, older than
        # ALERT_AFTER_N_DAYS days
        interesting_keys.extend(list(filter(lambda k: is_key_interesting(k), access_keys)))
    
    # We group the keys by owner, so we send no more than one notification for every user
    interesting_keys_grouped_by_user = defaultdict(list)
    for key in interesting_keys:
        interesting_keys_grouped_by_user[key['UserName']].append(key)

    for user in interesting_keys_grouped_by_user.values():
        # In our AWS account the username is always a valid email. 
        # However, you can recover the email from IAM tags, if you have them
        # or from other lookups
        # We also get the account id from the Lambda context, but you can 
        # also specify any id you want here, it's only used in the email 
        # sent to the users to let them know on which account they should
        # check
        send_notification(user[0]['UserName'], user, context.invoked_function_arn.split(":")[4])
```

# Schedule your Lambda

You can schedule your Lambda to run thanks to CloudWatch Events. You can use a schedule expression such `rate(3 days)`
to run the email every 3 days. Lambda will add necessary permissions to the role we created before to invoke the Lambda.
<small>If you need any help, AWS covers you with a [dedicated tutorial][schedule-lambda]!</small>

# Conclusions

This is just an idea on how to create a little script, leveraging AWS Lambda and AWS SES, to keep your AWS account safe.
There are, of course, lots of possible improvements! And remember to check the logs, sometimes ;-)

If you have hundreds or thousands of users, the function will go  in timeout: there are different solutions you can 
implement, as using tags on users to know when you have lasted checked them, or checking a different group of users
every our, leveraging the `PathPrefix` argument of `list_users`.

Also in my example it's simple knowing to whom send the notification email - but what if your users don't have their 
email as username? You can use tags, and set their contact email there. Or, you maybe have to implement a lookup 
somewhere else.

We could also send a daily report to admins: since users usually ignore automatic emails, admins can intervene if too
many reports have been ignored. Or, we can forcibly delete keys after some time - although this could break production
code, so I wouldn't **really** do it - or maybe yes, it's time developers learn to have a good secrets hygiene.

And you? How do you check your users rotate their access keys? 

For any comment, feedback, critic, suggestion on how to improve my English, reach me on Twitter ([@rpadovani93][twitter])
or drop an email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).
 
Ciao,  
R.

[best-practices]: https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html
[least-privilege]: https://en.wikipedia.org/wiki/Principle_of_least_privilege
[img-automation]: https://img.rpadovani.com/posts/automation.png
[automation]: https://xkcd.com/1319/
[twitter]: https://twitter.com/rpadovani93
[iam-create-role]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html
[snippet]: https://gitlab.com/snippets/1946017
[sandbox]: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
[verify-domains]: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html
[lambda-start]: https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html
[schedule-lambda]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html

