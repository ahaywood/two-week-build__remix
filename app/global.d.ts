declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      BASE_URL: string;
    };
  }
}

export type User = {
  id: string,
  created_at?: string,
  name: string,
  location?: string,
  website?: string,
  github?: string,
  twitter?: string,
  youtube?: string,
  discord?: string,
  tiktok?: string,
  linkedin?: string,
  avatar?: string,
  username?: string,
  projects?: Project[]
}

export type Project = {
  id: string,
  name: string,
  updates?: Update[],
  user_id?: string,
  cohort_id?: string,
  created_at?: string,
  description: string
  cohorts?: Cohort
}

export type Cohort = {
  id: string,
  name: string,
  created_at: string;
  year: number;
  month: number;
  number: number;
  start_date: string;
  end_date: string;
  projects?: Project[]
}

export type Update = {
  id: string,
  date: string,
  content: "string",
  created_at: string,
  project_id: string,
  emojis: Emoji[],
  comments: Comment[],
  projects?: Project
}

export type Emoji = {
  id: string,
  emoji: string,
  user_id?: string,
  update_id: string,
  count?: int,
  user_submitted?: boolean
}

export type Comment = {
  id: string,
  created_at: string,
  update_id: string,
  comment: string,
  user_id: string,
  users?: User
}