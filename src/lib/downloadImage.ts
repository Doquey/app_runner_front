import { S3 } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";

export async function downloadFromS3(
  fileKey: string,
  bucketName: string
): Promise<string | null> {
  try {
    const s3 = new S3({
      region: "sa-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: bucketName,
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);

    const { Body } = await s3.send(command);

    if (!Body) {
      throw new Error("No data returned from S3 getObject");
    }

    // Generate a presigned URL for the object
    const url = getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
}
