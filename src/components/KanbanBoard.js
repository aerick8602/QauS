import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../utils/api';
import TicketCard from './TicketCard';
import DisplayOptions from './DisplayOptions';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState(() => localStorage.getItem('groupBy') || 'status');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTickets();
      setTickets(data.tickets);
      setUsers(data.users);
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
  }, [groupBy]);

  const groupedTickets = groupTickets(tickets, groupBy);

  return (
    <div>
      <DisplayOptions groupBy={groupBy} setGroupBy={setGroupBy} />
      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([key, group]) => (
          <div key={key} className="kanban-column">
            <h3>{key}</h3>
            {group.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} users={users} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const groupTickets = (tickets, groupBy) => {
  if (groupBy === 'status') {
    const statuses = ['Todo', 'In Progress', 'Backlog', 'Done', 'Canceled']; // Define statuses in desired order
    const grouped = {};

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
    // Group by userId
    return tickets.reduce((groups, ticket) => {
      const key = ticket.userId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ticket);
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
};

export default KanbanBoard;
