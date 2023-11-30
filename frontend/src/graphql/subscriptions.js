/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateChatMessage = /* GraphQL */ `
  subscription OnCreateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onCreateChatMessage(filter: $filter) {
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
export const onUpdateChatMessage = /* GraphQL */ `
  subscription OnUpdateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onUpdateChatMessage(filter: $filter) {
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
export const onDeleteChatMessage = /* GraphQL */ `
  subscription OnDeleteChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onDeleteChatMessage(filter: $filter) {
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
export const onCreateEventChatRoom = /* GraphQL */ `
  subscription OnCreateEventChatRoom(
    $filter: ModelSubscriptionEventChatRoomFilterInput
  ) {
    onCreateEventChatRoom(filter: $filter) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateEventChatRoom = /* GraphQL */ `
  subscription OnUpdateEventChatRoom(
    $filter: ModelSubscriptionEventChatRoomFilterInput
  ) {
    onUpdateEventChatRoom(filter: $filter) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteEventChatRoom = /* GraphQL */ `
  subscription OnDeleteEventChatRoom(
    $filter: ModelSubscriptionEventChatRoomFilterInput
  ) {
    onDeleteEventChatRoom(filter: $filter) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
