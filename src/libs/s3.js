import fs from 'fs';
import aws from 'aws-sdk';

import dotenv from 'dotenv';

// dotenv
dotenv.config({ path: '.env'});

aws.config.update({
    accessKeyId:process.env.KEY_AWS,
    secretAccessKey:process.env.SECRET_AWS,
});

const s3 = new aws.S3();

const constantParams = {
    Bucket:process.env.BUCKET_AWS
}

const checkConection = () => { 
    s3.headBucket({
    Bucket: process.env.BUCKET_AWS
  }, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("success ", data);           // successful response
  });
};

//upload file to s3 bucker
const uploadToS3V2 = async (file) => {
    const fileStream = fs.createReadStream(file.tempFilePath);

    const params = {
        ...constantParams,
        Body:fileStream,
        Key:file.name
    };

    return await s3.upload(params).promise();
};

//download file from s3 bucket
const getFileFromS3 = async (key) =>{
    const downloadParams = {
        Key:key,
       ...constantParams
    };

    return s3.getObject(downloadParams).createReadStream();
};

export { uploadToS3V2, getFileFromS3, checkConection }; 