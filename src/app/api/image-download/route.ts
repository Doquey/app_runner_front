import { downloadFromS3 } from "@/lib/downloadImage";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { filename, bucketname } = body;
  try {
    const file_path = await downloadFromS3(filename, bucketname);

    return NextResponse.json(
      {
        file_path: file_path,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
