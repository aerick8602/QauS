import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../utils/api';
import TicketCard from './TicketCard';
import DisplayOptions from './DisplayOptions';
import Todo from "../assets/To-do.svg";
import Inprogress from "../assets/in-progress.svg";
import Done from "../assets/Done.svg";
import Cancel from "../assets/Cancelled.svg";
import Backlog from "../assets/Backlog.svg";
import Add from "../assets/add.svg";
import Menu from "../assets/3 dot menu.svg";
import UrgentPrioritycolor from "../assets/SVG - Urgent Priority colour.svg";
import UrgentPrioritygrey from "../assets/SVG - Urgent Priority grey.svg";
import NoPriority from "../assets/No-priority.svg";
import MediumPriority from "../assets/Img - Medium Priority.svg";
import LowPriority from "../assets/Img - Low Priority.svg";
import HighPriority from "../assets/Img - High Priority.svg";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [display, setDisplay] = useState('Grouping');
  const [groupBy, setGroupBy] = useState(() => localStorage.getItem('groupBy') || 'status');
  const [orderBy, setOrderBy] = useState(() => localStorage.getItem('orderBy') || 'Priority');
  const [users, setUsers] = useState([]);

  const Status = new Map([
    ["Todo", Todo],
    ["In Progress", Inprogress],
    ["Backlog", Backlog],
    ["Done", Done],
    ["Canceled", Cancel],
  ]);

  const PriorityIcons = new Map([
    [1, UrgentPrioritycolor],
    [2, HighPriority],
    [3, MediumPriority],
    [4, LowPriority],
    [0, NoPriority], 
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTickets();
      setTickets(data.tickets);
      setUsers(data.users);
    };
    fetchData();
  }, []);



  const groupedTickets = groupTickets(tickets, users, groupBy);
  const orderedTickets = orderTickets(tickets, orderBy);

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'Urgent';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'No priority';
    }
  };

  return (
    <div>
      <DisplayOptions
        display={display}
        setDisplay={setDisplay}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
      <div className="kanban-board">
        {display === 'Grouping' ? (
          Object.entries(groupedTickets).map(([key, group]) => (
            <div key={key} className="kanban-column">
              <div className='Header'>
              <div className='HeaderStatus'>
  {groupBy === 'priority' ? (
    <>
      <div>
        {PriorityIcons.get(Number(key)) && (
          <img src={PriorityIcons.get(Number(key))} alt={getPriorityLabel(Number(key))} />
        )}
      </div>
      
      <h5>{getPriorityLabel(Number(key))}</h5>
      <p  className='card-count'>{groupedTickets[key].length}</p>
    </>
  ) : groupBy === 'user' ? (
    <>
       <div className="default-icon"></div>
      <h5>{key}</h5>
    </>
  ) : (
    <>
      <div>
        {Status.get(key) ? (
          <img src={Status.get(key)} alt={key} />
        ) : (
          <div className='bullet'></div>
        )}
      </div>
      <h5>{key}</h5>
    </>
  )}
</div>

                <div className='HeaderButton'>
                  <img src={Add} alt="Add" />
                  <img src={Menu} alt="Menu" />
                </div>
              </div>
              {group.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy} />
              ))}
            </div>
          ))
        ) : (
          // Display ordered tickets in a single line
          <div className="ordered-tickets">

            {orderedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const groupTickets = (tickets, users, groupBy) => {
  const grouped = {};
  
  // Create a mapping of userId to username
  const userMap = {};
  if (Array.isArray(users)) {
    users.forEach(user => {
      userMap[user.id] = user.name; // Map userId to username
    });
  } else {
    console.error("Users is not an array:", users);
    return;
  }

  if (groupBy === 'status') {
    const statuses = ['Backlog', 'In Progress', 'Todo', 'Done', 'Canceled'];

    // Initialize empty arrays for each status
    statuses.forEach(status => {
      grouped[status] = [];
    });

    // Group tickets by status
    tickets.forEach(ticket => {
      const ticketStatus = ticket.status;
      if (grouped[ticketStatus]) {
        grouped[ticketStatus].push(ticket);
      }
    });
    return grouped;
  } else if (groupBy === 'user') {
    // Group by username
    return tickets.reduce((groups, ticket) => {
      const username = userMap[ticket.userId] || ticket.userId; // Get username or use userId if not found
      
      if (!groups[username]) {
        groups[username] = [];
      }
      groups[username].push(ticket);
      return groups;
    }, {});
  } else if (groupBy === 'priority') {
    // Group by priority
    return tickets.reduce((groups, ticket) => {
      const key = ticket.priority;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ticket);
      return groups;
    }, {});
  }
  return grouped; // Return the grouped tickets
};

const orderTickets = (tickets, orderBy) => {
  // Order tickets based on the selected criteria
  return [...tickets].sort((a, b) => {
    if (orderBy === 'Priority') {
      return b.priority - a.priority; // Assuming priority is numeric
    } else if (orderBy === 'Title') {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default case
  });
};

export default KanbanBoard;
