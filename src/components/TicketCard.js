import React from 'react';
// import { FaExclamation } from 'react-icons/fa';
import NoPrioity from  '../assets/No-priority.svg'
import '../styles/card.css';

const TicketCard = ({ ticket, users }) => {
  const user = users.find(user => user.id === ticket.userId);
  console.log(ticket);

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 4: return 'Urgent';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'No priority';
    }
  };

  return (
    <div className='ticket-card'>
      <div className='ticket-header'>
        <div className='ticket-id'>{ticket.id}</div>
        <div className='user-profile'>
          {user && user.profileImage ? (
            <img src={user.profileImage} alt={`${user.name}'s profile`} />
          ) : (
            <div className="default-user-icon"></div>
          )}
        </div>
      </div>
      <div className='ticket-title'>{ticket.title}</div>
      <div className='ticket-tag'>

        <div className='tag-label'>
          <div className='bullet'></div>
          {ticket.tag[0]}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
