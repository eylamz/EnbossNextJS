import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Function to upload an image to Cloudinary
export const uploadImage = async (file: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'enboss',
    })
    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

// Function to delete an image from Cloudinary
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return false
  }
}

// Get public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  const splitUrl = url.split('/')
  const filename = splitUrl[splitUrl.length - 1]
  const publicId = filename.split('.')[0]
  const folder = splitUrl[splitUrl.length - 2]
  return `${folder}/${publicId}`
}

export default cloudinary