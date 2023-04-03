import React, { useState } from "react";
import AWS from "aws-sdk";

const S3_BUCKET = "smashnftbucket";
const REGION = "Asia Pacific (Singapore) ap-southeast-1";

AWS.config.update({
  accessKeyId: "AKIA3ZJLLP3XSJORGEWN",
  secretAccessKey: "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",
});

export const myBucket = new AWS.S3({
  params: {
    Bucket: S3_BUCKET,
    region: REGION,
  },
});

const UploadImageToS3WithNativeSdk = () => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };
    const users = {
      id: 39,
      image: [
        "https://firebasestorage.googleapis.com/v0/b/smashnft-45a85.appspot.com/o/files%2FCapture.PNG?alt=media&token=d3042788-622f-4e52-b760-a9b456f61e52",
      ],
      price: "0.001",
      name: "SuperVet # 1",
      collection: "kS1muLeGdiuefM7PpdB2",
      url: "abc.com",
      description:
        "Smash NFT will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.\nDescription",
      royalities: "2",
      fileSize: 5365975,
      properties: "2",
    };

    // var putObjectPromise = await myBucket
    //   .putObject({
    //     Key: "users1.json",
    //     Body: JSON.stringify(users),
    //     ContentType: "application/json",
    //   })
    //   .promise()
    //   .then((res) => {
    //     console.log(`Upload succeeded - `, res.Location);
    //   })
    //   .catch((err) => {
    //     console.log("Upload failed:", err);
    //   });
    myBucket.listObjectsV2(
      {
        Delimiter: "",
        Prefix: "",
      },
      (err, data) => {
        if (err) throw err;
      }
    );

    // myBucket.getObject(
    //   {
    //     Bucket: "smashnftbucket",
    //     Key: "users1.json",
    //   },
    //   (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //   }
    // );
    // myBucket.getObjectAttributes(
    //   {
    //     Bucket: "smashnftbucket",
    //     Key: "users1.json",
    //     ObjectAttributes: ["ObjectParts","Checksum"],
    //   },
    //   (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //   }
    // );
    // myBucket
    //   .putObject(params)
    //   .on("httpUploadProgress", (evt) => {
    //     setProgress(Math.round((evt.loaded / evt.total) * 100));
    //   })
    //   .send((err) => {
    //     if (err) console.log(err);
    //   });
  };
  return (
    <div>
      <div>Native SDK File Upload Progress is {progress}</div>
      <input type="file" onChange={handleFileInput} />
      <button
        onClick={() => {
          uploadFile(selectedFile);
        }}
      >
        Upload to S3
      </button>
    </div>
  );
};
export const uploadJSONToAWS = async (JSONBody) => {
  if (!JSONBody) {
    return { success: false, msg: "JSON is empty", url: "" };
  } else {
    myBucket.listObjectsV2(
      {
        Delimiter: "",
        Prefix: "",
      },
      async (err, data) => {
        if (err) {
          return { success: false, msg: err, url: "" };
        }

        JSONBody.id = data.Contents.length;

        await myBucket
          .putObject({
            Key: data.Contents.length + 1 + ".json",
            Body: JSON.stringify(JSONBody),
            ContentType: "application/json",
          })
          .promise()
          .then((res) => {
            return {
              success: true,
              msg: res,
              url:
                "https://smashnftbucket.s3.ap-southeast-1.amazonaws.com/" +
                data.Contents.length +
                1 +
                ".json",
            };
          })
          .catch((err) => {
            console.log("Upload failed:", err);
            return { success: false, msg: err, url: "" };
          });
      }
    );
  }
};
