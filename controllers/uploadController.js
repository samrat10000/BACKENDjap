import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image file' });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return res.status(500).json({ message: 'Cloudinary environment variables are not configured' });
  }

  try {
    const folder = req.body.folder || 'general';

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `jap/${folder}`,
          resource_type: 'image',
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(uploadResult);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      filename: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
