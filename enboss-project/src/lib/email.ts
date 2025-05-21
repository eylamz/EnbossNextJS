import emailjs from '@emailjs/nodejs'

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

// Initialize EmailJS with environment variables
emailjs.init({
  publicKey: process.env.EMAILJS_USER_ID || '',
  privateKey: process.env.EMAILJS_API_KEY || '',
})

// Function to send contact form emails
export const emailContact = async (data: ContactFormData): Promise<boolean> => {
  try {
    const { name, email, subject, message } = data
    
    const templateParams = {
      name,
      email,
      subject,
      message,
    }
    
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || '',
      process.env.EMAILJS_TEMPLATE_ID || '',
      templateParams
    )
    
    console.log('Email sent successfully:', response.status, response.text)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}