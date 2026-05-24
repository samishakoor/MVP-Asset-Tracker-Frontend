export const AssetType = {
  LAPTOP: 'laptop',
  MONITOR: 'monitor',
  ACCESSORY: 'accessory',
  OTHER: 'other',
};

export const AssetCondition = {
  NEW: 'new',
  GOOD: 'good',
  FAIR: 'fair',
  DAMAGED: 'damaged',
};

export const AssetStatus = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  ACKNOWLEDGED: 'acknowledged',
  PENDING_REVIEW: 'pending_review',
  UNDER_REPAIR: 'under_repair',
};

export const EventType = {
  REGISTERED: 'registered',
  ASSIGNED: 'assigned',
  ACKNOWLEDGED: 'acknowledged',
  RETURNED: 'returned',
  TICKET_OPENED: 'ticket_opened',
  REPAIR_STARTED: 'repair_started',
  REPAIR_COMPLETED: 'repair_completed',
  DELETED: 'deleted',
  ASSIGNMENT_CANCELLED: 'assignment_cancelled',
};

export const ASSET_TYPE_OPTIONS = [
  { value: AssetType.LAPTOP, label: 'Laptop' },
  { value: AssetType.MONITOR, label: 'Monitor' },
  { value: AssetType.ACCESSORY, label: 'Accessory' },
  { value: AssetType.OTHER, label: 'Other' },
];

/** Default type slugs; custom types are stored as plain strings in the database. */
export const DEFAULT_ASSET_TYPE_VALUES = ASSET_TYPE_OPTIONS.map((option) => option.value);

export const ASSET_CONDITION_OPTIONS = [
  { value: AssetCondition.NEW, label: 'New' },
  { value: AssetCondition.GOOD, label: 'Good' },
  { value: AssetCondition.FAIR, label: 'Fair' },
  { value: AssetCondition.DAMAGED, label: 'Damaged' },
];

export const ASSET_STATUS_OPTIONS = [
  { value: AssetStatus.AVAILABLE, label: 'Available' },
  { value: AssetStatus.ASSIGNED, label: 'Assigned' },
  { value: AssetStatus.ACKNOWLEDGED, label: 'Acknowledged' },
  { value: AssetStatus.PENDING_REVIEW, label: 'Pending IT Review' },
  { value: AssetStatus.UNDER_REPAIR, label: 'Under Repair' },
];

/** Status values for active assignments (excludes available). */
export const ASSIGNMENT_STATUS_OPTIONS = [
  { value: AssetStatus.ASSIGNED, label: 'Assigned' },
  { value: AssetStatus.ACKNOWLEDGED, label: 'Acknowledged' },
  { value: AssetStatus.PENDING_REVIEW, label: 'Pending IT Review' },
  { value: AssetStatus.UNDER_REPAIR, label: 'Under Repair' },
];
