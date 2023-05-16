export interface Booking extends Document {
    id: string;
    user_id: string;
    room: {
      _id:string;
      name:string;
      capacity:number;
    };
    createdAt: Date;
    updatedAt: Date;
    state:string;
    scheduledAt: Date;
    scheduledUntil: Date;
  }