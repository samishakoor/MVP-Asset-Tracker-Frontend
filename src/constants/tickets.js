export const TicketStatus = {
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
};

export const TICKET_STATUS_OPTIONS = [
  { value: TicketStatus.OPEN, label: 'Open' },
  { value: TicketStatus.UNDER_REVIEW, label: 'Under Review' },
  { value: TicketStatus.RESOLVED, label: 'Resolved' },
];

export const TICKET_ACTIONS = {
  START_REPAIR: 'start_repair',
  RESOLVE: 'resolve',
};

export const TICKET_ACTION_OPTIONS = [
  { value: TICKET_ACTIONS.START_REPAIR, label: 'Start Repair' },
  { value: TICKET_ACTIONS.RESOLVE, label: 'Resolve' },
];
