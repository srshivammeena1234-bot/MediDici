export interface Medicine {
  id: string;
  name: string;
  price: number;
  salt: string;
  isAvailable: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  isAvailable: boolean;
  rating: number;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  // FIX: Changed type of `text` to `string` to resolve React namespace error and better reflect usage.
  text: string;
}
