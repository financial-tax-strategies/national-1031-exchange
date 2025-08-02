import { HighLevelService } from '../lib/services/highlevel.service';

// Re-export the HighLevelService for backward compatibility
export const highlevelService = new HighLevelService();
export { HighLevelService };