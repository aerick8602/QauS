export const groupTickets = (tickets, users, groupBy) => {
    const grouped = {};
    const userMap = {};
    if (Array.isArray(users)) {
      users.forEach(user => {
        userMap[user.id] = user.name;
      });
    } else {
      console.error("Users is not an array:", users);
      return;
    }
  
    if (groupBy === 'status') {
      const statuses = ['Backlog', 'In progress', 'Todo', 'Done', 'Canceled'];
      statuses.forEach(status => {
        grouped[status] = [];
      });
  
      tickets.forEach(ticket => {
        const ticketStatus = ticket.status;
        if (grouped[ticketStatus]) {
          grouped[ticketStatus].push(ticket);
        }
      });
      return grouped;
    } else if (groupBy === 'user') {
      return tickets.reduce((groups, ticket) => {
        const username = userMap[ticket.userId] || ticket.userId;
        if (!groups[username]) {
          groups[username] = [];
        }
        groups[username].push(ticket);
        return groups;
      }, {});
    } else if (groupBy === 'priority') {
      return tickets.reduce((groups, ticket) => {
        const key = ticket.priority;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(ticket);
        return groups;
      }, {});
    }
    return grouped;
  };