/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChatMessage = /* GraphQL */ `
  mutation CreateChatMessage(
    $input: CreateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    createChatMessage(input: $input, condition: $condition) {
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
export const updateChatMessage = /* GraphQL */ `
  mutation UpdateChatMessage(
    $input: UpdateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    updateChatMessage(input: $input, condition: $condition) {
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
export const deleteChatMessage = /* GraphQL */ `
  mutation DeleteChatMessage(
    $input: DeleteChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    deleteChatMessage(input: $input, condition: $condition) {
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
export const createEventChatRoom = /* GraphQL */ `
  mutation CreateEventChatRoom(
    $input: CreateEventChatRoomInput!
    $condition: ModelEventChatRoomConditionInput
  ) {
    createEventChatRoom(input: $input, condition: $condition) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateEventChatRoom = /* GraphQL */ `
  mutation UpdateEventChatRoom(
    $input: UpdateEventChatRoomInput!
    $condition: ModelEventChatRoomConditionInput
  ) {
    updateEventChatRoom(input: $input, condition: $condition) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteEventChatRoom = /* GraphQL */ `
  mutation DeleteEventChatRoom(
    $input: DeleteEventChatRoomInput!
    $condition: ModelEventChatRoomConditionInput
  ) {
    deleteEventChatRoom(input: $input, condition: $condition) {
      eventId
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
