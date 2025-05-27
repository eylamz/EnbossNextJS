require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// --- Define Schemas ---

// DaySchedule Schema for OperatingHours
const dayScheduleSchema = new mongoose.Schema({
  openingTime: { type: String, required: true }, // e.g., "08:00"
  closingTime: { type: String, required: true }, // e.g., "22:00"
  isOpen: { type: Boolean, default: true }
}, { _id: false });

// OperatingHours Schema
const operatingHoursSchema = new mongoose.Schema({
  sunday: { type: dayScheduleSchema, required: true },
  monday: { type: dayScheduleSchema, required: true },
  tuesday: { type: dayScheduleSchema, required: true },
  wednesday: { type: dayScheduleSchema, required: true },
  thursday: { type: dayScheduleSchema, required: true },
  friday: { type: dayScheduleSchema, required: true },
  saturday: { type: dayScheduleSchema, required: true },
  holidays: { type: dayScheduleSchema, required: true } // For special holiday hours
}, { _id: false });

// LightingHours Schema
const lightingHoursSchema = new mongoose.Schema({
  startTime: { type: String, required: false }, // e.g., "17:00"
  endTime: { type: String, required: false },   // e.g., "22:00"
  is24Hours: { type: Boolean, default: false }
}, { _id: false });

// Amenities Schema
const amenitiesSchema = new mongoose.Schema({
  entryFee: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  bathroom: { type: Boolean, default: false },
  shade: { type: Boolean, default: false },
  helmetRequired: { type: Boolean, default: false },
  guard: { type: Boolean, default: false },
  seating: { type: Boolean, default: false },
  bombShelter: { type: Boolean, default: false }, // מקלט
  scootersAllowed: { type: Boolean, default: true },
  bikesAllowed: { type: Boolean, default: true },
  noWax: { type: Boolean, default: false }
}, { _id: false });

// SkateparkImage Schema
const skateparkImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  orderNumber: { type: Number, required: true, default: 0 }
}, { _id: false });

// Skatepark Schema (Updated)
const skateparkSchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true },
    nameHe: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    area: { type: String, required: true, enum: ['north', 'center', 'south'] },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    addressEn: { type: String, required: true },
    addressHe: { type: String, required: true },
    openingYear: { type: Number, required: true },
    closingYear: { type: Number },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    operatingHours: { type: operatingHoursSchema, required: true },
    lightingHours: { type: lightingHoursSchema, required: true },
    amenities: { type: amenitiesSchema, required: true },
    isFeatured: { type: Boolean, default: false },
    images: [skateparkImageSchema],
    mediaLinks: {
      googleMapsFrame: { type: String },
      googleMapsUrl: { type: String },
      wazeUrl: { type: String },
      appleMapsUrl: { type: String },
      youtubeUrl: { type: String }
    },
    notesEn: { type: Array },
    notesHe: { type: Array },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

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

// --- Create Models ---
const Skatepark = mongoose.models.Skatepark || mongoose.model('Skatepark', skateparkSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);

// --- Sample Data ---

const defaultDaySchedule = {
  openingTime: "08:00",
  closingTime: "22:00",
  isOpen: true
};

const defaultOperatingHours = {
  sunday: { ...defaultDaySchedule },
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { openingTime: "08:00", closingTime: "18:00", isOpen: true },
  saturday: { openingTime: "09:00", closingTime: "22:00", isOpen: true },
  holidays: { openingTime: "10:00", closingTime: "20:00", isOpen: true }
};

const defaultLightingHours = {
  startTime: "17:30",
  endTime: "22:00",
  is24Hours: false
};

const defaultAmenities = {
  entryFee: false,
  parking: true,
  bathroom: true,
  shade: false,
  helmetRequired: false,
  guard: false,
  seating: true,
  bombShelter: true,
  scootersAllowed: true,
  bikesAllowed: true,
  noWax: false
};


const skateparks = [
  {
    nameEn: 'Kfar Saba',
    nameHe: 'כפר סבא',
    slug: 'kfar-saba',
    area: 'center',
    status: 'active',
    addressEn: 'Kfar Saba Park, Har Tavor St 123, Kfar Saba',
    addressHe: 'פארק כפר סבא, הר תבור 123, כפר סבא',
    openingYear: 2011,
    location: { latitude: 32.1661, longitude: 34.8033 },
    operatingHours: {
      sunday: { openingTime: "15:00", closingTime: "22:00", isOpen: true },
      monday: { openingTime: "15:00", closingTime: "22:00", isOpen: true },
      tuesday: { openingTime: "15:00", closingTime: "22:00", isOpen: true },
      wednesday: { openingTime: "15:00", closingTime: "22:00", isOpen: true },
      thursday: { openingTime: "15:00", closingTime: "22:00", isOpen: true },
      friday: { openingTime: "13:00", closingTime: "22:00", isOpen: true },
      saturday: { openingTime: "10:00", closingTime: "22:00", isOpen: true },
      holidays: { openingTime: "10:00", closingTime: "22:00", isOpen: true }
    },
    lightingHours: { ...defaultLightingHours },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: true,
      shade: false,
      helmetRequired: true,
      guard: true,
      seating: true,
      bombShelter: false,
      scootersAllowed: false,
      bikesAllowed: false,
      noWax: false
    },
    isFeatured: true,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737795/j5omdsdm9o4dp94jwvqj.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737797/va1lyxyjmi9mhpf4lpvi.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737798/vsennfzjaklkwhdzkimo.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737799/fbltstaitnpsrtriun7l.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737800/dfrrkarzvspje374lue4.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737801/dhoyxtfab72lkwxm2as1.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737802/nekp7bv8jdlmrwlgblp4.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737803/pagiiynme4huxrrmfjy0.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739737804/ez3dayp0ghrtlog2izhj.webp', isFeatured: false, orderNumber: 9 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.910012345678!2d34.80079831570995!3d32.16610098119000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d48f7b1a2c3d1%3A0x1234567890abcdef!2sHerzliya%20Skatepark!5e0!3m2!1sen!2sil!4v1620000000000!5m2!1sen!2sil',
      googleMapsUrl: 'https://goo.gl/maps/1jvQDGCZPLZxYH8B7',
      wazeUrl: 'https://waze.com/ul?ll=32.1661,34.8033&navigate=yes',
      appleMapsUrl: 'https://maps.apple.com/?ll=32.1661,34.8033',
      youtubeUrl: 'https://www.youtube.com/watch?v=examplevideo1'
    },
    notesEn: ['Entry for scooter and bicycle riders is prohibited.', 'Helmet is mandatory for entry.'],
    notesHe: ['הכניסה לרוכבי קורקינט ואופניים אסורה.', 'כניסה עם קסדה חובה.'],
    rating: 0,
    ratingCount: 0
  },
  {
    nameEn: 'Tel Aviv Skatepark (Sportek)',
    nameHe: 'סקייטפארק תל אביב (ספורטק)',
    slug: 'tel-aviv-sportek-skatepark',
    area: 'center',
    status: 'active',
    addressEn: 'Sportek Tel Aviv, Rokach Blvd, Tel Aviv',
    addressHe: 'ספורטק תל אביב, שדרות רוקח, תל אביב',
    openingYear: 2018,
    closingYear: 2024,
    location: { latitude: 32.1045, longitude: 34.8095 }, // Adjusted coordinates for Sportek area
    operatingHours: {
        ...defaultOperatingHours,
        sunday: { openingTime: "00:00", closingTime: "23:59", isOpen: true }, // 24/7 example
        monday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
        tuesday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
        wednesday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
        thursday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
        friday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
        saturday: { openingTime: "00:00", closingTime: "23:59", isOpen: true },
    },
    lightingHours: { startTime: "00:00", endTime: "23:59", is24Hours: true },
    amenities: { ...defaultAmenities, parking: false, bathroom: true },
    isFeatured: true,
    images: [
      { url: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=', isFeatured: true, orderNumber: 1 }
    ],
    mediaLinks: {
      googleMapsUrl: 'https://goo.gl/maps/Mur7c8aqARf6XmQv5', // Example URL
      wazeUrl: 'https://waze.com/ul?ll=32.1045,34.8095&navigate=yes'
    },
    notesEn: ['Large skatepark located within Sportek Tel Aviv. Usually crowded.'],
    notesHe: ['סקייטפארק גדול הממוקם בספורטק תל אביב. בדרך כלל עמוס.'],
    rating: 0,
    ratingCount: 0
  },
  {
    nameEn: 'Hadera',
    nameHe: 'חדרה',
    slug: 'hadera',
    area: 'north',
    status: 'active',
    addressEn: 'HaNevel St 30, Hadera',
    addressHe: 'הנבל 30, חדרה',
    openingYear: 2016,
    location: { latitude: 32.427734, longitude: 34.913104 },
    operatingHours: {
      sunday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      monday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      tuesday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      wednesday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      thursday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      friday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      saturday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      holidays: { openingTime: "00:02", closingTime: "23:58", isOpen: true }
    },
    lightingHours: { startTime: "00:01", endTime: "23:00", is24Hours: true },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: false,
      shade: false,
      helmetRequired: false,
      guard: false,
      seating: true,
      bombShelter: false,
      scootersAllowed: true,
      bikesAllowed: true,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872470/jfsuykydebxzjjoysm7h.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872586/ifz5ueuh', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872589/zsu00x4t', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872592/hhy3kvoy', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872595/cu21fjtw', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872598/yj0d4gyr', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872601/zozwru9s', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872604/hf9htgav', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872607/clvg0bcs', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872610/vmaa63jq', isFeatured: false, orderNumber: 10 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872613/uyvie18a', isFeatured: false, orderNumber: 11 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872616/kprfvlj5', isFeatured: false, orderNumber: 12 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872619/tloyxf2a', isFeatured: false, orderNumber: 13 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13467.71379705526',
      googleMapsUrl: 'https://www.google.com/maps/place/skate+park+hadera+%D7%A1%D7%A7%D7%99',
      wazeUrl: 'https://waze.com/ul/hsvbb6rq9j',
      appleMapsUrl: 'https://maps.apple.com/?ll=32.427734,34.913104&q=Dropped%20Pin&t=h',
      youtubeUrl: ''
    },
    notesEn: [],
    notesHe: [],
    rating: 0,
    ratingCount: 0
  },
  {
    nameEn: 'Petah Tikva - Kfar Ganim C',
    nameHe: 'פתח תקווה - כפר גנים ג\'',
    slug: 'petah-tikva-kfar-ganim-c',
    area: 'center',
    status: 'active',
    addressEn: 'Moshe Nakash St 11, Petah Tikva',
    addressHe: 'משה נקש 11, פתח תקווה',
    openingYear: 2015,
    closingYear: 2024,
    location: { latitude: 32.07089655403081, longitude: 34.86060305874667 },
    operatingHours: {
      sunday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      monday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      tuesday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      wednesday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      thursday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      friday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      saturday: { openingTime: "00:02", closingTime: "23:58", isOpen: true },
      holidays: { openingTime: "00:02", closingTime: "23:58", isOpen: true }
    },
    lightingHours: { startTime: "00:01", endTime: "23:00", is24Hours: true },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: false,
      shade: false,
      helmetRequired: false,
      guard: false,
      seating: true,
      bombShelter: false,
      scootersAllowed: true,
      bikesAllowed: true,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269936/lwfn1e8oqfjgp9msrwib.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269935/jnqdr1jjf8fdovgi1kec.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269942/qwxxps1ii8tlez5dcqnw.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269942/ytjzebc4', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269937/dk5gcdlh', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269939/gelyajgi', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269940/zf5iw2w8', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269938/w7ttgbid', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269941/hvss6pun', isFeatured: false, orderNumber: 9 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6761.914277169549',
      googleMapsUrl: 'https://maps.app.goo.gl/zmRzsR4jzNiBEkJ88?g_st=ic',
      wazeUrl: 'https://waze.com/ul/hsv8y3q0xd',
      appleMapsUrl: 'https://maps.apple.com/?ll=32.070343,34.860413&q=Dropped%20Pin&_ext=Ei',
      youtubeUrl: ''
    },
    notesEn: [],
    notesHe: [],
    rating: 0,
    ratingCount: 0
  },
];

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

// --- Connect to MongoDB and Seed Database ---
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await Skatepark.deleteMany({});
    await Product.deleteMany({});
    await Guide.deleteMany({});
    console.log('Existing data cleared.');

    console.log('Inserting new data...');
    await Skatepark.insertMany(skateparks);
    await Product.insertMany(products);
    await Guide.insertMany(guides);
    console.log('New data inserted.');

    console.log(`Inserted ${skateparks.length} skateparks.`);
    console.log(`Inserted ${products.length} products.`);
    console.log(`Inserted ${guides.length} guides.`);

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
