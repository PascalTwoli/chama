/**
 * Custom event system for notification updates
 * Allows components to notify each other when notification counts change
 */

export const NOTIFICATION_EVENTS = {
  UPDATED: 'notifications:updated',
} as const;

/**
 * Dispatch a notification update event
 * Call this after marking notifications as read
 */
export const dispatchNotificationUpdate = () => {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENTS.UPDATED));
};

/**
 * Listen for notification update events
 * @param callback Function to call when notifications are updated
 * @returns Cleanup function to remove the listener
 */
export const onNotificationUpdate = (callback: () => void) => {
  window.addEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
  return () => window.removeEventListener(NOTIFICATION_EVENTS.UPDATED, callback);
};
