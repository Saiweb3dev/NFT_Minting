import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs";

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImage(imagesFilePath: any) {
 const fullImagesPath = path.resolve(imagesFilePath);
 const files = fs.readdirSync(fullImagesPath);
 console.log("StoreImage function Running ....")
 console.log("----------------------------");
 console.log(files);
 let responses = [];
 for (let fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
    try {
      // Include the filename in the metadata
      const response = await pinata.pinFileToIPFS(readableStreamForFile, {
        pinataMetadata: {
          name: files[fileIndex] // Use the filename as the name
        }
      });
      responses.push(response);
    } catch (err) {
      console.log(err);
    }
 }
 console.log("StoreImage function Finished ....")
 console.log("----------------------------");
 return { responses, files };
}

const storeTokenUriMetaData = async (metadata:any) => {
  try{
    console.log("storeTokenUriMetaData function Running ....")
 console.log("----------------------------");
    const response = await pinata.pinJSONToIPFS(metadata);
    return response
  }catch(err){
    console.log(err)
  }
  return null
}

const main = async () => {
 const result = await storeImage("./Image");
 console.log(result);
};

main();

export {storeImage,storeTokenUriMetaData}