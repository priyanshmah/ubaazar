import { v2 as Cloudinary } from 'cloudinary'
import sharp from 'sharp';

Cloudinary.config({
    cloud_name: "dxweby5rk",
    api_key: "524628146221277",
    api_secret: "DWdbjuKVqZRq7AK4EYCLMq-1I8Y"
});

export const uploadImages = async (files, folder) => {

    const uploadPromises = files.map(async(file) => {
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        const compressedImage = await sharp(bytes)
            .jpeg({ quality: 20 })
            .toBuffer();

        return new Promise(async (resolve, reject) => {
            Cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: folder
            }, async (err, result) => {
                if (err) {
                    reject(err.message)
                }
                else {
                    resolve(result.secure_url)
                }
            }).end(compressedImage);

        })
    })

    const uploaded_urls = await Promise.all(uploadPromises);

    return uploaded_urls;

}



export default Cloudinary