require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// --- Define Schemas ---

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    variants: [{
      color: { type: String, required: true },
      hexCode: { type: String, required: true },
      sizes: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 }
      }],
      images: [{ type: String, required: true }]
    }],
    basePrice: { type: Number, required: true },
    discount: { type: Number },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    isFeatured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const guideSchema = new mongoose.Schema(
  {
    titleHe: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    contentHe: { type: String, required: true },
    contentEn: { type: String, required: true },
    tagsHe: [{ type: String }],
    tagsEn: [{ type: String }],
    category: { type: String, required: true, enum: ['roller', 'skate', 'scoot', 'bike'] },
    featuredImage: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, required: true, enum: ['draft', 'active', 'inactive'], default: 'draft' },
    isFeatured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      he: { type: String, required: true }
    },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, required: true },
      he: { type: String, required: true }
    },
    category: { type: String, required: true, enum: ['competition', 'workshop', 'event'] },
    images: [{ type: String, required: true }],
    featuredImage: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    tags: {
      en: [{ type: String }],
      he: [{ type: String }]
    },
    status: { type: String, required: true, enum: ['published', 'draft', 'cancelled'] },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

// --- Create Models ---
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

// --- Sample Data ---

const products = [
  {
    name: 'סקייטבורד ENBOSS Pro',
    slug: 'enboss-pro-skateboard',
    description: 'סקייטבורד מקצועי בעיצוב מיוחד, מושלם למתחילים ומתקדמים',
    category: 'skate',
    variants: [
      {
        color: 'שחור',
        hexCode: '#000000',
        sizes: [
          { size: '7.75"', price: 499, stock: 10 },
          { size: '8"', price: 499, stock: 15 },
          { size: '8.25"', price: 519, stock: 12 }
        ],
        images: [
          'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
          'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
        ]
      },
      {
        color: 'כחול',
        hexCode: '#0066cc',
        sizes: [
          { size: '7.75"', price: 499, stock: 8 },
          { size: '8"', price: 499, stock: 10 },
          { size: '8.25"', price: 519, stock: 5 }
        ],
        images: [
          'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
          'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
        ]
      }
    ],
    basePrice: 499,
    status: 'active',
    isFeatured: true
  },
];

const guides = [
  {
    titleHe: 'מדריך מתחילים לסקייטבורד',
    titleEn: 'Beginner\'s Guide to Skateboarding',
    slug: 'beginners-guide-to-skateboarding',
    contentHe: `<h2>מבוא לסקייטבורד</h2><p>סקייטבורד הוא אחד מספורט האקסטרים הפופולריים ביותר בעולם...</p>`,
    contentEn: `<h2>Introduction to Skateboarding</h2><p>Skateboarding is one of the most popular extreme sports...</p>`,
    tagsHe: ['סקייטבורד', 'מתחילים', 'טריקים'],
    tagsEn: ['skateboarding', 'beginners', 'tricks'],
    category: 'skate',
    featuredImage: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
    images: [
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
    ],
    status: 'active',
    isFeatured: true
  },
];

const events = [
  {
    title: {
      en: 'Tel Aviv Skateboarding Championship 2024',
      he: 'אליפות תל אביב בסקייטבורד 2024'
    },
    slug: 'tel-aviv-skateboarding-championship-2024',
    description: {
      en: 'Join us for the biggest skateboarding competition in Tel Aviv! Open to all skill levels, with special categories for beginners, intermediate, and professional riders. Prizes include cash rewards, sponsored gear, and more!',
      he: 'הצטרפו אלינו לתחרות הסקייטבורד הגדולה בתל אביב! פתוח לכל הרמות, עם קטגוריות מיוחדות למתחילים, מתקדמים ומקצוענים. פרסים כוללים פרסים כספיים, ציוד מחסות ועוד!'
    },
    category: 'competition',
    images: [
      'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269936/lwfn1e8oqfjgp9msrwib.webp',
      'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269935/jnqdr1jjf8fdovgi1kec.webp',
      'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269942/qwxxps1ii8tlez5dcqnw.webp'
    ],
    featuredImage: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269936/lwfn1e8oqfjgp9msrwib.webp',
    isFeatured: true,
    tags: {
      en: ['competition', 'skateboarding', 'tel-aviv', 'championship'],
      he: ['תחרות', 'סקייטבורד', 'תל-אביב', 'אליפות']
    },
    status: 'published',
    date: new Date('2024-07-15T10:00:00.000Z')
  }
];

// --- Connect to MongoDB and Seed Database ---
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Guide.deleteMany({});
    await Event.deleteMany({});
    console.log('Existing data cleared.');

    console.log('Inserting new data...');
    await Product.insertMany(products);
    await Guide.insertMany(guides);
    await Event.insertMany(events);
    console.log('New data inserted.');

    console.log(`Inserted ${products.length} products.`);
    console.log(`Inserted ${guides.length} guides.`);
    console.log(`Inserted ${events.length} events.`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
