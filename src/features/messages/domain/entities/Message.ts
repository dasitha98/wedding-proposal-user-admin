export type MessageSender = 'me' | 'them';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  sentAt: string;
}
