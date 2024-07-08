const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {folder};
    if(height) {

        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    // apne type determine kar lo ki kis type ki file hai by setting it auto
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}