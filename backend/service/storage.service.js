import '../config/env.js';  // Import this first
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(file, filename){
    const response = await imagekit.upload({
        file: file,
        fileName: filename,
        folder: "social-media-images"
    })
    return response;
}

export default uploadImage;
