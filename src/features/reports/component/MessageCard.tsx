import React from 'react';

interface MessageCardProps {
  color: string;
  number: number;
  title: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ color, number, title }) => {

  const possibleBorders:string[] = ["border-blue-500", "border-red-500", "border-yellow-500", "border-green-500"]; /* Only these colors are allowed for borders */

  return (
    <div className={`bg-${color}-500 border-${color}-500 border-2 h-40 w-80 bg-opacity-20 rounded-lg text-center text-black grid place-content-center mt-10`}>
      <h4 className='text-xl mb-5'>{title}</h4>
      <p className='text-5xl font-light'>{number}</p>
    </div>
  );
};


export default MessageCard;