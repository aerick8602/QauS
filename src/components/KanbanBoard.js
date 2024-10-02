import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../utils/api';
import TicketCard from './Card';
import DisplayOptions from './Display';
import { Todo, Inprogress, Done, Cancel, Backlog, Add, Menu, UrgentPrioritycolor, NoPriority, MediumPriority, LowPriority, HighPriority } from '../utils/svg';
import { groupTickets } from '../tasks/grouping';
import { orderTickets } from '../tasks/ordering';
import "../styles/KanbanBoard.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [display, setDisplay] = useState('Grouping');
  const [orderBy, setOrderBy] = useState(() => localStorage.getItem('orderBy') || 'Priority');
  const [groupBy, setGroupBy] = useState(() => localStorage.getItem('groupBy') || 'status');
  const [loading, setLoading] = useState(true);

  const Status = new Map([
    ["Todo", Todo],
    ["In progress", Inprogress],
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
      setLoading(false);
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
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
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
                          <p className='card-count'>{groupedTickets[key].length}</p>
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
              <div className="ordered-tickets">
                {orderedTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
