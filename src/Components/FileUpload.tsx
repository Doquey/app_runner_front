import { uploadToS3 } from "@/lib/s3";
import { useState, ChangeEvent } from "react";
import axios from "axios";

type Props = {
  task: string;
};

const FileUpload = ({ task }: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [imagePath, setimagePath] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false); // Added loading state
  const [bucketname, setbucketName] = useState<string | null>(null);

  const options = {
    detection: "apprunnerdetections",
    segmentation: "apprunnersegmentations",
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      setLoading(true); // Set loading state to true when uploading starts
      try {
        const data = await uploadToS3(image);
        console.log("Image uploaded to S3:", data);

        if (!data.file_name) {
          console.log("Something went wrong with S3 upload");
          return;
        }

        setFilename(data.file_name);

        const response = await fetch("http://localhost:8000/task/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: task,
            imgPath: data.file_name,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Backend response:", responseData);
          setbucketName(options[task]);
          const res = await axios.post("/api/image-download", {
            filename,
            bucketname,
          });
          setimagePath(res.data.url);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading state to false after uploading finishes
      }
    }
  };
  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        Upload Image
      </button>{" "}
      {/* Disable button while loading */}
      <div>
        {isLoading ? ( // Display loading message while loading
          <p>Loading image...</p>
        ) : (
          imagePath && <img src={imagePath} alt="Image" /> // Render image when imageUrl is available
        )}
      </div>
    </div>
  );
};

export default FileUpload;
