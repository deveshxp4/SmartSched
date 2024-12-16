// app/api/upload-avatar.js
import multer from 'multer';
import nextConnect from 'next-connect';
import cloudinary from '../../lib/cloudinary'; // Cloudinary setup
import streamifier from 'streamifier';

// Set up Multer to handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();

// Handle file upload
handler.use(upload.single('avatar')).post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Create a readable stream from the file buffer
  const streamUpload = (file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: 'avatars' }, // Optional: specify a folder on Cloudinary
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  };

  try {
    const result = await streamUpload(req.file);
    res.status(200).json({ message: 'Avatar uploaded successfully', imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

export default handler;
