export interface IStorage {
  // Add any storage methods needed for the application
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage if needed
  }
}

export const storage = new MemStorage();
