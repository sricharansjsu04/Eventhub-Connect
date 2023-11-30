/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChatMessage = /* GraphQL */ `
  query GetChatMessage($id: ID!) {
    getChatMessage(id: $id) {
      user
      body
      createdAt
      chatRoomId
      id
      updatedAt
      __typename
    }
  }
`;
export const listChatMessages = /* GraphQL */ `
  query ListChatMessages(
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        user
        body
        createdAt
        chatRoomId
        id
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEventChatRoom = /* GraphQL */ `
  query GetEventChatRoom($id: ID!) {
    getEventChatRoom(id: $id) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEventChatRooms = /* GraphQL */ `
  query ListEventChatRooms(
    $filter: ModelEventChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        eventId
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listChatMessagesByChatRoomIdAndCreatedAt = /* GraphQL */ `
  query ListChatMessagesByChatRoomIdAndCreatedAt(
    $chatRoomId: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessagesByChatRoomIdAndCreatedAt(
      chatRoomId: $chatRoomId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        user
        body
        createdAt
        chatRoomId
        id
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
