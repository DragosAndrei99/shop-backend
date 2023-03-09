import { S3Event } from "aws-lambda";
import * as AWS from "aws-sdk";
import csvParser from "csv-parser";
const s3 = new AWS.S3({ region: "us-east-1" });

export const importFileParserFunction = async (event: S3Event) => {
  const results = [];
  try {
    const key = event.Records[0].s3.object.key;
    const bucket = process.env.S3_BUCKET_NAME;
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream
      .pipe(csvParser())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        console.log(results);
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

    return { message: "success", key };
  } catch (error) {
    console.log(error);
    return { message: error.message, error };
  }
};
