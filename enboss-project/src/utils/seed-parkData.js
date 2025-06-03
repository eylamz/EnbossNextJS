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

// Skatepark Schema
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
      youtubeUrl: { type: String }
    },
    notesEn: { type: Array },
    notesHe: { type: Array },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// --- Create Model ---
const Skatepark = mongoose.models.Skatepark || mongoose.model('Skatepark', skateparkSchema);

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
    location: { latitude: 32.17949961763035, longitude: 34.92565599591348 },
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
    isFeatured: false,
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
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13507.787629848921!2d34.91278500216247!3d32.17870638966543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d39291f50cf4f%3A0xb539f2798bc417ce!2z16HXp9eZ15nXmdeY16TXkNeo16cg15vXpNeoINeh15HXkA!5e0!3m2!1sen!2sil!4v1748506998861!5m2!1sen!2sil',
    },
    notesEn: ['Entry for scooter and bicycle riders is prohibited.', 'Helmet is mandatory for entry.'],
    notesHe: ['הכניסה לרוכבי קורקינט ואופניים אסורה.', 'כניסה עם קסדה חובה.'],
    rating: 0,
    ratingCount: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    nameEn: 'Dimona',
    nameHe: 'דימונה',
    slug: 'dimona',
    area: 'south',
    status: 'active',
    addressEn: 'Tel Givon St, Dimona',
    addressHe: 'תל גבעון, דימונה.',
    openingYear: 2023,
    location: { latitude: 31.058887917668223, longitude: 35.03233826744868 },
    operatingHours: {
        ...defaultOperatingHours,
        sunday: { openingTime: "16:00", closingTime: "20:00", isOpen: true },
        monday: { openingTime: "16:00", closingTime: "20:00", isOpen: true },
        tuesday: { openingTime: "16:00", closingTime: "20:00", isOpen: true },
        wednesday: { openingTime: "16:00", closingTime: "20:00", isOpen: true },
        thursday: { openingTime: "16:00", closingTime: "20:00", isOpen: true },
        friday: { openingTime: "11:00", closingTime: "00:00", isOpen: true },
        saturday: { openingTime: "00:00", closingTime: "00:00", isOpen: true },
        holidays: { openingTime: "00:00", closingTime: "00:00", isOpen: true }
    },
    lightingHours: { startTime: "00:00", endTime: "23:59", is24Hours: true },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: false,
      shade: false,
      helmetRequired: true,
      guard: true,
      seating: false,
      bombShelter: false,
      scootersAllowed: true,
      bikesAllowed: true,
      noWax: false
    },    
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828045/ixbkz8djnrhnwyz5gict.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828046/bsmazeuzz8zb82mkeebx.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828047/nroq7z2ovcq05hzp9hx6.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828049/ulr5zrculd2zx3lpheci.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828050/nwuuozupnwzpawgsqcqa.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828051/qlod8aizvrynpzkuhqd2.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828052/j7oxwc8v5es7wizy5lup.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828053/gpqgwfsh4xdb7ibsqfvv.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828054/zofod2dkxkrvpm2fodlu.webp', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828056/ud70lzpmv0arhk68fto8.webp', isFeatured: false, orderNumber: 10 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828057/f0xoyp30xdgeaojmrxss.webp', isFeatured: false, orderNumber: 11 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740828058/kgt7wj4ovicbb9smhqm8.webp', isFeatured: false, orderNumber: 12 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30299.543560707447!2d35.021400061359905!3d31.059147193338962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x150247a46318da8f%3A0x3aa3b67855523a48!2z15TXoden15nXmdeY16TXkNeo16cg16nXnCDXmNecINeR15PXmdee15XXoNeU!5e0!3m2!1siw!2sil!4v1726039117461!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/0z45EWo0GYE?si=hkoHuP3f-vK9-yIb'
    },
    notesEn: ['Riders are required to wear a helmet', 'On Fridays and Saturdays, the lights are turned off'],
    notesHe: ['כניסה עם קסדה חובה', 'בימי שישי ושבת התאורה לא פעילה'],
    rating: 3.8,
    ratingCount: 13,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    nameEn: 'Kiryat Ata',
    nameHe: 'קרית אתא',
    slug: 'kiryat-ata',
    area: 'north',
    status: 'active',
    addressEn: 'Kiryat Ata Park, Har Tavor St 123, Kfar Saba',
    addressHe: 'פארק הספורט לוקי, רחוב נתן שפריצר, קרית אתא',
    openingYear: 2023,
    location: { latitude: 32.81479158068334, longitude: 35.121177318088115 },
    operatingHours: {
      sunday: { openingTime: "08:00", closingTime: "23:00", isOpen: false },
      monday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      tuesday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      wednesday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      thursday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      friday: { openingTime: "08:00", closingTime: "17:00", isOpen: true },
      saturday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      holidays: { openingTime: "08:00", closingTime: "23:00", isOpen: true }
    },
    lightingHours: { ...defaultLightingHours },
    amenities: {
      entryFee: true,
      parking: true,
      bathroom: true,
      shade: false,
      helmetRequired: false,
      guard: false,
      seating: false,
      bombShelter: false,
      scootersAllowed: true,
      bikesAllowed: false,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340699/tu5doswkvvbop3cef3x1.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340700/z6ti8ixky8ldjt30xiow.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340701/e9wimyncuxivttw6uyyt.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340702/hd1traazpxo5obldvif0.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340703/psdpw4qyuvqsieeuxb2k.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340704/d1pcunlqkphvoaw2waev.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340705/cuznzkckgxginknmkc88.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340706/ddgwmprydwdlp4l5tsok.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340707/oeaocdh5fkrwcvd7jssu.webp', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340708/ffshs7zuqlxhn6weetga.webp', isFeatured: false, orderNumber: 10 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340709/o7xecfpv2dhvs4x8x1qh.webp', isFeatured: false, orderNumber: 11 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340711/z7m9sizwdkghh6cvldrt.webp', isFeatured: false, orderNumber: 12 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6149.783432268138!2d35.12651847668962!3d32.81362186166062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151db6a17420f5af%3A0xefc840f7c2afbf18!2z16TXkNeo16cg16HXpNeV16jXmNenINe015zXlden15nXtCAo16fXqNeZ16og15DXqteQKQ!5e0!3m2!1siw!2sil!4v1726041751201!5m2!1siw!2sil',
    },
    notesEn: ['Admission fee : Adult - 60₪, Child - 30₪.', 'Free entry for Kiryat Ata residents.', 'Bike riders are not allowed to enter.'],
    notesHe: ['כניסה בתשלום : מבוגר - 60 ₪, ילד - 30 ₪.', 'הכניסה חינם לתושבי קרית אתא.', 'הכניסה לרוכבי אופניים אסורה.'],
    rating: 0,
    ratingCount: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
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
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872586/ifz5ueuhshzkv8jbivkb.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872589/zsu00x4tqa2acghqs49y.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872592/hhy3kvoyninvtxyscjv1.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872595/cu21fjtwfu56pyxt2bqi.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872598/yj0d4gyrt7nr6s9nlsfq.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872601/zozwru9sih9xthsnxuuc.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872604/hf9htgavdikbumbipsvx.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872607/clvg0bcseeu5qi1a3ur1.webp', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872610/vmaa63jqi7iyyp7f4qhu.webp', isFeatured: false, orderNumber: 10 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872613/uyvie18aadfvqbv5qbt6.webp', isFeatured: false, orderNumber: 11 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872616/kprfvlj5is1cl4u78koc.webp', isFeatured: false, orderNumber: 12 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1739872619/tloyxf2agwziyt4chznz.webp', isFeatured: false, orderNumber: 13 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13507.787629848921!2d34.91278500216247!3d32.17870638966543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d39291f50cf4f%3A0xb539f2798bc417ce!2z16HXp9eZ15nXmdeY16TXkNeo16cg15vXpNeoINeh15HXkA!5e0!3m2!1sen!2sil!4v1748506998861!5m2!1sen!2sil',
      youtubeUrl: ''
    },
    notesEn: [],
    notesHe: [],
    rating: 0,
    ratingCount: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
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
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269942/ytjzebc4oke4wzkg63mn.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269937/dk5gcdlhd8vh7mqt0qhp.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269939/gelyajgi4y042aa2yqla.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269940/zf5iw2w80cclhwvw2eac.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269938/w7ttgbid28c40znx3gon.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741269941/hvss6punn6apaauunxmo.webp', isFeatured: false, orderNumber: 9 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6761.914277169549!2d34.860426!3d32.070408!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4a0a057a9fad%3A0x4db5aba30b920bf!2z16HXp9eZ15nXmNek15DXqNenINek16rXlyDXqten15XXldeU!5e0!3m2!1siw!2sil!4v1726125977969!5m2!1siw!2sil',
      youtubeUrl: ''
    },
    notesEn: [],
    notesHe: [],
    rating: 0,
    ratingCount: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    nameEn: 'Gedera',
    nameHe: 'גדרה',
    slug: 'gedera',
    area: 'center',
    status: 'active',
    addressEn: 'Sapir St 34, Gedera',
    addressHe: 'ספיר 5, גדרה',
    openingYear: 2016,
    location: { latitude: 31.799415915272277, longitude: 34.779582870030495 },
    operatingHours: {
      sunday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      monday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      tuesday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      wednesday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      thursday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      friday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      saturday: { openingTime: "08:00", closingTime: "23:00", isOpen: true },
      holidays: { openingTime: "08:00", closingTime: "23:00", isOpen: true }
    },
    lightingHours: { startTime: "00:01", endTime: "23:00", is24Hours: false },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: false,
      shade: false,
      helmetRequired: false,
      guard: false,
      seating: true,
      bombShelter: false,
      scootersAllowed: false,
      bikesAllowed: false,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341577/tbczjn0pv2avwzj9hxip.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341578/zl2kvg8kpigcblq9lptt.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341579/uvzdcf3gxpwmtz5hhwti.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341581/wh20xxt7bhvem55gfjpi.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341582/bj1ipcdbrex98tovdixu.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341583/xg1huh4mb64snahffrz0.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740341584/iqrpnsa3yp1eezfcxboi.webp', isFeatured: false, orderNumber: 7 },

    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6504.894233304706!2d34.7862953324249!3d31.797743615476783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b9571e68f11b%3A0x456db4fbcc61bbc7!2z16HXp9eZ15nXmNek15DXqNenINeS15PXqNeU!5e0!3m2!1siw!2sil!4v1726040988335!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/hzZ8HsFCksg?si=TbypB308bEkZrMpQ'
    },
    notesEn: [],
    notesHe: [],
    rating: 3.3,
    ratingCount: 44,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },

  {
    nameEn: 'Mitzpe Ramon',
    nameHe: 'מצפה רמון',
    slug: 'mitzpe-ramon',
    area: 'south',
    status: 'active',
    addressEn: 'Sderot David Ben Gurion 16, Mitzpe Ramon',
    addressHe: 'שדרות דוד בן גוריות 16, מצפה רמון',
    openingYear: 2017,
    location: { latitude: 30.60991939056803, longitude: 34.80119258817613 },
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
    lightingHours: { startTime: "00:01", endTime: "22:00", is24Hours: true },
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
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687059/j7rl5rmoxxqfhyltgklt.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687060/rnuyzkkt1rrespobaswr.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687062/vhkldmnhxk6auqh6pmk8.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687064/ijshxzigsha9q0ceejst.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687067/tzsxddrewmcjfbpt5mfs.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687069/rbyovwrfxg0ghamueabe.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687074/f3gw9cuhvoste9yiegwx.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1743687081/dq9iwyxdratsbqu7cohh.webp', isFeatured: false, orderNumber: 8 },
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9285.496858410927!2d34.805168093706456!3d30.612219959649426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1501f3d418eff145%3A0x793b474145222a6e!2z16HXp9eZ15nXmNek15DXqNenINee16bXpNeUINeo157Xldef!5e0!3m2!1siw!2sil!4v1726042787316!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/Z4M9LpLQCAM?si=XKgt8kUQBaF3Z0jG'
    },
    notesEn: [],
    notesHe: [],
    rating: 3.1,
    ratingCount: 21,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },

  {
    nameEn: 'Herzliya',
    nameHe: 'הרצליה',
    slug: 'herzliya',
    area: 'center',
    status: 'active',
    addressEn: 'Jabotinsky St, corner of Yosef Nevo, Herzliya',
    addressHe: 'ז\'בוטינסקי פינת יוסף נבו, הרצליה',
    openingYear: 2011,
    location: { latitude: 32.16875687286787, longitude: 34.826570128135934 },
    operatingHours: {
      sunday: { openingTime: "14:00", closingTime: "22:00", isOpen: true },
      monday: { openingTime: "14:00", closingTime: "22:00", isOpen: true },
      tuesday: { openingTime: "14:00", closingTime: "22:00", isOpen: true },
      wednesday: { openingTime: "14:00", closingTime: "22:00", isOpen: true },
      thursday: { openingTime: "14:00", closingTime: "22:00", isOpen: true },
      friday: { openingTime: "13:00", closingTime: "22:00", isOpen: true },
      saturday: { openingTime: "10:00", closingTime: "22:00", isOpen: true },
      holidays: { openingTime: "10:00", closingTime: "22:00", isOpen: true }
    },
    lightingHours: { startTime: "00:01", endTime: "23:00", is24Hours: false },
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
      noWax: true
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521959/klsv4x6wkm6jfkhzmdwg.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521961/cr72me6ckcql5qkajlg9.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521964/qbwumwkjitrlkcyjoyvv.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521967/evd1gq7vau9ykzzwk3fa.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521970/mj6p7lqltncwtrql31rb.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521973/fxveymj38tayswmql9cl.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521975/xcfrscc9svvqtlxk6lfd.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521978/cece4nlh8okwiebagu3c.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521982/jqykicgbfv9npczbfigh.webp', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1741521985/f9zguyba6educciesviw.webp', isFeatured: false, orderNumber: 10 }
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18502.92518255621!2d34.835503945419276!3d32.16240212214751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d487afe3620ab%3A0x9ab4441d6f3e388c!2z16HXp9eZ15nXmNek15DXqNen!5e0!3m2!1siw!2sil!4v1726046222118!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/X3Cisc9gM9s?si=QuZLmV0WE74u1u2P'
    },
    notesEn: [
        'Scooter and bike riders are not allowed to enter',
        'Riders are required to wear a helmet',
        'No waxing allowed in the park'
    ],
    notesHe: [
        'הכניסה לרוכבי קורקינט ואופניים אסורה',
        'אסורה מריחת שעווה בפארק',
        'כניסה עם קסדה חובה',
    ],
    rating: 3.7,
    ratingCount: 12,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },


  {
    nameEn: 'Ramat Gan - National Park',
    nameHe: 'רמת גן - פארק לאומי',
    slug: 'ramat-gan-national-park',
    area: 'center',
    status: 'active',
    addressEn: 'Sderat Hatsvi St 3, Ramat Gan',
    addressHe: 'שדרת הצבי 3, רמת גן',
    openingYear: 2023,
    location: { latitude: 32.05075508178183, longitude: 34.827344586968046 },
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
    lightingHours: { startTime: "00:01", endTime: "00:00", is24Hours: true },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: true,
      shade: false,
      helmetRequired: false,
      guard: false,
      seating: true,
      bombShelter: true,
      scootersAllowed: true,
      bikesAllowed: false,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154102/wlufgmby2s0mpolw7i8q.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154105/mqr1nvxoab2ssg9h1nr6.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154109/khyyzee2h3wuxqtxgemo.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154111/papr4fubohf36hy7brfq.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154113/hziwmmukw3tfmqdmrocc.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154115/qsx7topc34qytakfvb1m.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154118/zbwxzvmuthpgw31zlsxv.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154120/xkk7jw6al1ousrfqbknx.webp', isFeatured: false, orderNumber: 8 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154123/xol4pyouhyyd1qwq5atv.webp', isFeatured: false, orderNumber: 9 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154125/cmhrzo6a7timjuyd9abq.webp', isFeatured: false, orderNumber: 10 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154127/m4nhrbletx6lxv0ahmzk.webp', isFeatured: false, orderNumber: 11 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154134/tmhimugn6thypzl87sj1.webp', isFeatured: false, orderNumber: 12 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154136/ihufljtecttejjnwthcs.webp', isFeatured: false, orderNumber: 13 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154137/ou5kasiicjezsevy4vfn.webp', isFeatured: false, orderNumber: 14 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154140/mbydefcbawtjaxje2ue3.webp', isFeatured: false, orderNumber: 15 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154141/hqqget3it3jhzc89ncud.webp', isFeatured: false, orderNumber: 16 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154143/iurljydlgpaib0lofsxv.webp', isFeatured: false, orderNumber: 17 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740154145/jocppnwqkzn1qffpb5qc.webp', isFeatured: false, orderNumber: 18 },
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2300.8525368562105!2d34.82740521605095!3d32.051869545464776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b92414dcaa7%3A0x20b569516a5bc8e8!2z16HXp9eZ15nXmNek15DXqNenINeo157XqiDXktef!5e0!3m2!1siw!2sil!4v1726038559208!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/B8oK_SlXMKQ?si=quXg2gEhIBucuL5z'
    },
    notesEn: ['Bike riders are not allowed to enter'],
    notesHe: ['הכניסה לרוכבי אופניים אסורה'],
    rating: 4.2,
    ratingCount: 15,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },


  {
    nameEn: 'Ra\'anana',
    nameHe: 'רעננה',
    slug: 'raanana',
    area: 'center',
    status: 'active',
    addressEn: 'Sasha Argov St 34, Ra\'anana',
    addressHe: 'סשה ארגוב 34, רעננה',
    openingYear: 2017,
    location: { latitude: 32.1930830916651, longitude: 34.86185918110985 },
    operatingHours: {
      sunday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      monday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      tuesday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      wednesday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      thursday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      friday: { openingTime: "08:00", closingTime: "19:00", isOpen: true },
      saturday: { openingTime: "08:00", closingTime: "22:00", isOpen: true },
      holidays: { openingTime: "08:00", closingTime: "22:00", isOpen: true }
    },
    lightingHours: { startTime: "00:01", endTime: "23:00", is24Hours: false },
    amenities: {
      entryFee: false,
      parking: true,
      bathroom: true,
      shade: true,
      helmetRequired: false,
      guard: false,
      seating: true,
      bombShelter: false,
      scootersAllowed: true,
      bikesAllowed: false,
      noWax: false
    },
    isFeatured: false,
    images: [
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340425/kf3u3icyia2nh4ztxlfi.webp', isFeatured: true, orderNumber: 1 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340427/mayzngfnnhvqvejjmme3.webp', isFeatured: false, orderNumber: 2 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340428/bunandrzu7gx86cqk4mk.webp', isFeatured: false, orderNumber: 3 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340429/a5axa9ssqztpkxsudlbv.webp', isFeatured: false, orderNumber: 4 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340431/irs1bgl8ik6wxqvqgj08.webp', isFeatured: false, orderNumber: 5 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340432/jtyh7tdsjwdyfknpquvh.webp', isFeatured: false, orderNumber: 6 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340433/yoxejuzhmuefjly5fntv.webp', isFeatured: false, orderNumber: 7 },
      { url: 'https://res.cloudinary.com/dr0rvohz9/image/upload/v1740340434/ulagtthqpjlf68v3szg7.webp', isFeatured: false, orderNumber: 8 },
    ],
    mediaLinks: {
      googleMapsFrame: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9072.400058289271!2d34.87247486625663!3d32.18887192493237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d478832845c4b%3A0xd29a0da0f3e5597d!2z16HXp9eZ15nXmNek15DXqNenINeo16LXoNeg15Qg15TXl9eT16k!5e0!3m2!1siw!2sil!4v1726041158743!5m2!1siw!2sil',
      youtubeUrl: 'https://www.youtube.com/embed/Ya1UYf2tgek?si=iNVkabMurWZS5zu5'
    },
    notesEn: [
        'Bike riders are not allowed to enter',
        'On Mondays and Thursdays, the park is open until 23:00',
        'There is covering for sun protection in the park',
        'From 20:00, no entry is allowed for children under 14 years old'],
    notesHe: [
        'בימי שני וחמישי הפארק פתוח עד 23:00',
        'מהשעה 20:00 אין כניסה מתחת לגיל 14',
        'הכניסה לרוכבי אופניים אסורה',
        'קיימת הצללה בפארק נגד השמש'
    ],
    rating: 3.2,
    ratingCount: 10,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },


];

// --- Connect to MongoDB and Seed Database ---
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing skatepark data...');
    await Skatepark.deleteMany({});
    console.log('Existing skatepark data cleared.');

    console.log('Inserting new skatepark data...');
    await Skatepark.insertMany(skateparks);
    console.log('New skatepark data inserted.');

    console.log(`Inserted ${skateparks.length} skateparks.`);

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