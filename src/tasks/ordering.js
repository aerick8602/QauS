export const orderTickets = (tickets, orderBy) => {
    return [...tickets].sort((a, b) => {
      if (orderBy === 'Priority') {
        return b.priority - a.priority;
      } else if (orderBy === 'Title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };
  