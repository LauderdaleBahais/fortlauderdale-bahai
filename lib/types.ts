export type Database = {
  public: {
    Tables: {
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at'>>
      }
      board_threads: {
        Row: BoardThread
        Insert: Omit<BoardThread, 'id' | 'created_at'>
        Update: Partial<Omit<BoardThread, 'id' | 'created_at'>>
      }
      board_replies: {
        Row: BoardReply
        Insert: Omit<BoardReply, 'id' | 'created_at'>
        Update: Partial<Omit<BoardReply, 'id' | 'created_at'>>
      }
      business_listings: {
        Row: BusinessListing
        Insert: Omit<BusinessListing, 'id' | 'created_at'>
        Update: Partial<Omit<BusinessListing, 'id' | 'created_at'>>
      }
      resources: {
        Row: Resource
        Insert: Omit<Resource, 'id'>
        Update: Partial<Omit<Resource, 'id'>>
      }
      devotional_gatherings: {
        Row: DevotionalGathering
        Insert: Omit<DevotionalGathering, 'id' | 'created_at'>
        Update: Partial<Omit<DevotionalGathering, 'id' | 'created_at'>>
      }
      contact_messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>
      }
      email_subscribers: {
        Row: EmailSubscriber
        Insert: Omit<EmailSubscriber, 'id' | 'created_at' | 'unsubscribe_token'>
        Update: Partial<Omit<EmailSubscriber, 'id' | 'created_at'>>
      }
    }
  }
}

export type Event = {
  id: string
  title: string
  description: string | null
  location: string | null
  start_time: string
  end_time: string | null
  status: 'pending' | 'approved'
  submitted_by: string | null
  is_holy_day: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image_url: string | null
  published: boolean
  author_id: string | null
  author_name: string | null
  created_at: string
}

export type BoardThread = {
  id: string
  title: string
  body: string
  author_id: string
  author_name: string | null
  pinned: boolean
  created_at: string
}

export type BoardReply = {
  id: string
  thread_id: string
  body: string
  author_id: string
  author_name: string | null
  created_at: string
}

export type BusinessListing = {
  id: string
  business_name: string
  owner_id: string
  owner_name: string | null
  category: string
  description: string | null
  website_url: string | null
  phone: string | null
  email: string | null
  location: string | null
  status: 'pending' | 'approved' | 'featured'
  created_at: string
}

export type Resource = {
  id: string
  title: string
  url: string
  description: string | null
  category: string | null
  sort_order: number
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export type EmailSubscriber = {
  id: string
  email: string
  name: string | null
  unsubscribe_token: string
  subscribed: boolean
  created_at: string
}

export type DevotionalGathering = {
  id: string
  title: string
  type: 'Devotional' | 'Study Circle' | "Children's Class" | 'Junior Youth' | 'Other'
  description: string | null
  location: string | null
  address: string | null
  schedule: string
  recurrence: 'weekly' | 'biweekly' | 'monthly' | 'one-time'
  day_of_week: string | null
  time_of_day: string | null
  host_name: string | null
  host_contact: string | null
  status: 'pending' | 'approved'
  submitted_by: string | null
  created_at: string
}

export const DEVOTIONAL_TYPES = [
  'Devotional',
  'Study Circle',
  "Children's Class",
  'Junior Youth',
  'Other',
] as const

export const BUSINESS_CATEGORIES = [
  'Contractor',
  'Legal',
  'Medical/Health',
  'Financial',
  'Real Estate',
  'Food/Restaurant',
  'Technology',
  'IT Services',
  'Education',
  'Arts/Creative',
  'Retail',
  'Other',
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]
