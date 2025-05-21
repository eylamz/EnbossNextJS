# Enboss - Skatepark Directory & Shop

Enboss is a comprehensive platform for skateparks in Israel, providing information about skateparks, guides for various board sports, and an e-commerce shop for related equipment.

## Features

- **Multilingual Support**: Hebrew and English interfaces
- **Skatepark Directory**: Detailed information about skateparks across Israel
- **Guides**: Educational content for skateboarding, roller skating, scootering, and BMX
- **E-commerce Shop**: Purchase equipment with variant selection (colors, sizes)
- **User Accounts**: Save favorites, track orders, and manage preferences
- **Admin Interface**: Manage content, products, and users

## Tech Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Payment Processing**: Payo
- **Caching**: Redis via Upstash
- **Email Service**: EmailJS
- **Authentication**: JWT
- **Internationalization**: i18next

## Project Structure

enboss-project/
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   │   ├── admin/            # Admin interface components
│   │   ├── layout/           # Layout components (header, footer)
│   │   ├── skatepark/        # Skatepark-related components
│   │   ├── guides/           # Guide-related components
│   │   ├── shop/             # Shop-related components
│   │   ├── user/             # User-related components
│   │   └── ui/               # Reusable UI components
│   ├── context/              # React context providers
│   ├── lib/                  # Library and utility functions
│   ├── models/               # MongoDB schema models
│   ├── utils/                # Utility functions
│   ├── hooks/                # Custom React hooks
│   └── assets/               # Static assets
│       └── icons/            # SVG icon components
├── public/                   # Public assets
│   ├── images/               # Static images
│   └── locales/              # Internationalization files
│       ├── en/               # English translations
│       └── he/               # Hebrew translations
├── .env.local                # Environment variables (not in version control)
├── next.config.js            # Next.js configuration
├── next-i18next.config.js    # i18next configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Project dependencies


Getting Started 

Prerequisites

Node.js (v14 or higher)
npm or yarn
MongoDB Atlas account
Cloudinary account
Upstash Redis account
Payo merchant account
EmailJS account

Installation

Clone the repository:
bashgit clone https://github.com/yourusername/enboss-project.git
cd enboss-project

Install dependencies:
npm install
# or
yarn install

Set up environment variables:
Copy the .env.local.example file to .env.local and fill in your API keys and configuration values.
Run the development server:
bashnpm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

Deployment
The project can be deployed to Vercel, which is optimized for Next.js applications:

Create a Vercel account and link it to your GitHub repository
Configure the environment variables in the Vercel dashboard
Deploy the project

Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

## Final Steps to Complete the Project Setup

1. Create a `.env.local.example` file to help other developers understand the required environment variables:

**`.env.local.example`**
Database
MONGODB_URI=your_mongodb_atlas_connection_string

Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Email Service
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_USER_ID=your_emailjs_user_id

Payment Gateway
PAYO_API_KEY=your_payo_api_key
PAYO_SECRET_KEY=your_payo_secret_key

Redis Upstash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

Site Settings
DEFAULT_LANGUAGE=he
SITE_URL=http://localhost:3000
