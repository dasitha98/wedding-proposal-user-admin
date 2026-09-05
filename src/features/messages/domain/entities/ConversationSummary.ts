import type { ProfileSummary } from '../../../../shared/types/ProfileSummary';

export interface ConversationSummary {
  profileId: string;
  profile: ProfileSummary;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  isLastMessageMine: boolean;
  unreadCount: number;
}
