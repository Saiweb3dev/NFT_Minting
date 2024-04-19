import pinataSDK from "@pinata/sdk"
import path from "path"
import fs from "fs"
async function storeImage(imagesFilePath:any){
  const fullImagesPath = path.resolve(imagesFilePath)
  const files = fs.readdirSync(fullImagesPath)
  console.log(files)
}
const main = async () => {
  const image = "./Image"
  storeImage(image)
}
main()
