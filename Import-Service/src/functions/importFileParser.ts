import { S3Event } from "aws-lambda";
import * as AWS from "aws-sdk";
import csvParser from "csv-parser";
import stripBom from "strip-bom-stream";

const s3 = new AWS.S3({ region: "us-east-1" });
const sqs = new AWS.SQS({ region: "us-east-1" });
const bucket = process.env.S3_BUCKET_NAME;
const queueUrl = process.env.QUEUE_URL;

export const importFileParserFunction = async (event: S3Event) => {
  try {
    const key = event.Records[0].s3.object.key;
    const s3params = {
      Bucket: bucket,
      Key: key,
    };
    const s3Stream = s3.getObject(s3params).createReadStream();
    s3Stream
      .pipe(stripBom())
      .pipe(csvParser())
      .on("data", (data) => {
        let message = JSON.stringify(data);
        const sqsParams = {
          MessageBody: message,
          QueueUrl: queueUrl
         };
         sqs.sendMessage(sqsParams, (err, result) => {
          if(err) {
            console.log(err);
            return 
          }
          console.log({sqsResult: result});
         });
      })
      .on("end", () => {
      });  

    await s3
      .copyObject({
        Bucket: bucket,
        CopySource: bucket + "/" + key,
        Key: key.replace("uploaded", "parsed"),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    return { message: "success"};
  } catch (error) {
    console.log(error);
    return { message: error.message, error };
  }
};
