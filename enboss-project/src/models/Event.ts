import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: {
    en: string;
    he: string;
  };
  slug: string;
  description: {
    en: string;
    he: string;
  };
  category: string;
  images: string[];
  featuredImage: string;
  isFeatured: boolean;
  tags: {
    en: string[];
    he: string[];
  };
  status: 'draft' | 'published' | 'archived';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema({
  title: {
    en: { type: String, required: true },
    he: { type: String, required: true }
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: {
    en: { type: String, required: true },
    he: { type: String, required: true }
  },
  category: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  featuredImage: { 
    type: String, 
    required: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  tags: {
    en: [{ type: String }],
    he: [{ type: String }]
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  date: { 
    type: Date, 
    required: true 
  }
}, {
  timestamps: true
});

// Create text index for search functionality
EventSchema.index({ 
  'title.en': 'text', 
  'title.he': 'text',
  'description.en': 'text',
  'description.he': 'text',
  'tags.en': 'text',
  'tags.he': 'text'
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 