export interface Study {
  id?: string;
  name: string;
}

export interface UserStudies {
  id: string;
  user_id: string;
  study_id: string;
}
