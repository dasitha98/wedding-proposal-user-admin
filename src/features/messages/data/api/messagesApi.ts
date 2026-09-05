import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, unwrapApiResponse } from '../../../../core/api/apiClient';
import { toProfileSummary, type BackendProfileSummary } from '../../../../shared/types/ProfileSummary';
import type { ConversationSummary } from '../../domain/entities/ConversationSummary';
import type { Message } from '../../domain/entities/Message';

interface BackendConversationSummary {
  profileId: string;
  otherParty: BackendProfileSummary;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  isLastMessageMine: boolean;
  unreadCount: number;
}

interface BackendMessage {
  id: string;
  text: string;
  senderUserId: string;
  sentAt: string;
}

function toConversationSummary(response: BackendConversationSummary): ConversationSummary {
  return {
    profileId: response.profileId,
    profile: toProfileSummary(response.otherParty),
    lastMessageText: response.lastMessageText,
    lastMessageAt: response.lastMessageAt,
    isLastMessageMine: response.isLastMessageMine,
    unreadCount: response.unreadCount,
  };
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Conversations', 'Conversation'],
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationSummary[], void>({
      query: () => '/messages/conversations',
      transformResponse: (response: { success: boolean; data?: BackendConversationSummary[]; error?: string }) =>
        unwrapApiResponse(response).map(toConversationSummary),
      providesTags: ['Conversations'],
    }),

    getConversation: builder.query<{ messages: Message[]; currentUserId: string }, { profileId: string; currentUserId: string }>({
      query: ({ profileId }) => `/messages/conversations/${profileId}`,
      transformResponse: (
        response: { success: boolean; data?: BackendMessage[]; error?: string },
        _meta,
        { currentUserId }
      ) => ({
        currentUserId,
        messages: unwrapApiResponse(response).map((m) => ({
          id: m.id,
          text: m.text,
          sender: m.senderUserId === currentUserId ? ('me' as const) : ('them' as const),
          sentAt: m.sentAt,
        })),
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Conversation', id: arg.profileId }],
    }),

    sendMessage: builder.mutation<Message, { profileId: string; text: string; currentUserId: string }>({
      query: ({ profileId, text }) => ({
        url: `/messages/conversations/${profileId}`,
        method: 'POST',
        body: { text },
      }),
      transformResponse: (response: { success: boolean; data?: BackendMessage; error?: string }, _meta, { currentUserId }) => {
        const m = unwrapApiResponse(response);
        return {
          id: m.id,
          text: m.text,
          sender: m.senderUserId === currentUserId ? ('me' as const) : ('them' as const),
          sentAt: m.sentAt,
        };
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Conversation', id: arg.profileId }, 'Conversations'],
    }),
  }),
});

export const { useGetConversationsQuery, useGetConversationQuery, useSendMessageMutation } = messagesApi;
