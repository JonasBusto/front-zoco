export interface Direction {
  id?: string;
  name: string;
}

export interface UserDirections {
  id: string;
  user_id: string;
  direction_id: string;
}
