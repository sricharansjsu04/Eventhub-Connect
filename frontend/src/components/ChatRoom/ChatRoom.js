import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import Queries, { listChatMessages,listChatMessagesByChatRoomIdAndCreatedAt } from '../../graphql/queries';
import Subscriptions, { onCreateChatMessage } from '../../graphql/subscriptions'
import Mutations, { createChatMessage } from '../../graphql/mutations'
import { Container, Row, Col, Form,InputGroup, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import config from '../../amplifyconfiguration.json';

Amplify.configure(config);
const client = generateClient();
const ChatRoom = ({loggedInUser,chatRoomId}) => {
    
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
  
    const editText=messages;
    useEffect(() => {
      // Fetch initial chat messages on component mount
      fetchChatMessages();
  
      // Subscribe to new messages
      const subscription = client.graphql({
        query:onCreateChatMessage ,
        filter: { chatRoomId: {eq: chatRoomId}
        
      }}
      ).subscribe({
        next: (eventData) => {
          console.log(eventData);
          if(eventData.data!==undefined)
          {
                console.log(eventData.data);
                const newMessage = eventData.data.onCreateChatMessage;
                console.log(newMessage);
                if (newMessage) {
                  setMessages((prevMessages) => [...prevMessages, newMessage]);
                  console.log(newMessage);
                }
                
          }
        }
    }
      );
      return () => subscription.unsubscribe();
      // Cleanup subscription on component unmount
      
    }, [chatRoomId]);
  
    const fetchChatMessages = async () => {
      try {
        const response = await client.graphql({
          query: listChatMessagesByChatRoomIdAndCreatedAt,
          variables: { chatRoomId: chatRoomId, 
          sortDirection: 'ASC'},
        });
        const fetchedMessages = response.data.listChatMessagesByChatRoomIdAndCreatedAt.items;
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching chat messages', error);
      }
    };
    
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if(messages!=="") // Prevents the default form submission behavior
        handleSendMessage(); // Clear the input field
      }
    };
    const handleSendMessage = async () => {
      try {
  
        const input = {
          user: loggedInUser,
          body: newMessage,
          chatRoomId: chatRoomId,
        };
        console.log(input.user+"|"+input.body+"|"+input.chatRoomId+"|");
        await client.graphql({
          query: createChatMessage,
          variables: { input },
        });
  
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message', error);
      }
  };

  return (
    <Container className="message-container">
      <Row className="chatmessages">
        <Col className="chatmessages-scroller">
          {messages.map((message) => (
            <div key={message.id} className={message.user === loggedInUser ? 'message me' : 'message'}>
              <div className="message-header">
                <b style={{color:"#212529"}}>{message.user}:</b>
              </div>
              <div className="message-body">{message.body}</div>
            </div>
          ))}
        </Col>
      </Row>
      <Row className="chat-bar">
        <Col>
          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                type="text"
                name="message"
                placeholder="Type your message here..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                onKeyDown={handleKeyPress}
              />
             <Button variant="outline-secondary" id="button-addon2" onClick={() => { handleSendMessage()}}>
              Send
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
  
  export default ChatRoom;