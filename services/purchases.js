// This file provides helper functions for IAP that can be used outside of React components
// For use in React components, import and use the useIAP hook directly from 'react-native-iap'

import { getProStatus, setProStatus } from './database';

// Product IDs
export const PRODUCT_ID = 'pro_version';

// Check current pro status from database
export const checkProStatus = () => {
  return getProStatus();
};

// Update pro status in database
export const updateProStatus = (status) => {
  return setProStatus(status);
};
