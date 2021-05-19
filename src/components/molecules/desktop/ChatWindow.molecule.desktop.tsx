import React from 'react';
import styled from 'styled-components';

export default function ChatWindowComponent({ chatIsActive, x, y }: { chatIsActive: boolean, x: number, y: number }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (inputRef.current) {
    if (chatIsActive) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    } 
  }

  return (
    chatIsActive ? <ChatWindow active={chatIsActive} x={x} y={y + 50}>
      <ChatContainer>
        <div>
          <BubbleContainer><ChatBubble>Hello world!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
          <BubbleContainer><ChatBubble>Yes, hello!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
          <BubbleContainer><ChatBubble>Hows everyone doing!?</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
          <BubbleContainer><ChatBubble>Great!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
          <BubbleContainer><ChatBubble client>Hey!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
        </div>
        <ChatInput type="textfield" ref={inputRef} />
      </ChatContainer>
    </ChatWindow> : <></>
  )
}

const ChatInput = styled.input`
  width: calc(100% - 30px);
  padding: 15px;
  border-radius: 5px;
  border: none;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.2);
  margin: 10px 0 0;
`;

const ChatWindow = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 500px;
  background: rgba(1, 1, 1, 0.6);
  pointer-events: none;
  opacity: ${({ active }: { active: boolean, x: number, y: number }) => active ? 1 : 0};
  display: inline-flex;
  flex-direction: column;
  transition: opacity 0.2s, backdrop-filter 0.2s;
  padding: 10px;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  transform: translate(${({ x, y }) => `${x}px, ${y}px`});
  overflow: hidden;
`;

const ChatContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BubbleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const ChatBubble = styled.div`
  padding: 8px 10px;
  // background: ${({ client }: { client?: boolean }) => client ? "lightgreen" : "#"};
  display: inline-block;
  font-size: 14px;
  color: ${({ client }: { client?: boolean }) => client ? "lightgreen" : "#cccccc"};
`;

const ChatTime = styled.div`
  align-self: center;
  color: #ccc;
  font-size: 10px;
  opacity: 0.2;
  // width: 10%;
  font-style: italic;
  text-align: left;
`;

const ChatUser = styled.div`
  align-self: center;
  color: #ccc;
  font-size: 12px;
  opacity: 0.4;
  width: 25%;
`;