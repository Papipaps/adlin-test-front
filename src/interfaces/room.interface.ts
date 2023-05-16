export interface Equipment {
  name: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  equipements: Equipment[];
  createdAt: Date;
  updatedAt: Date | null;
  img?:string;
}
