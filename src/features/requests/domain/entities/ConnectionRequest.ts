import type { ProfileSummary } from '../../../../shared/types/ProfileSummary';

export type ConnectionRequestStatus = 'sent' | 'pending' | 'accepted' | 'declined' | 'blocked';

export interface ConnectionRequest {
  id: string;
  profile: ProfileSummary;
  status: ConnectionRequestStatus;
  createdAt: string;
}
