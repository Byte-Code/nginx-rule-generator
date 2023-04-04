import crypto from 'crypto';
import { Location } from './Location';

export const guessFileName = (location: Location) => {
  const baseUrlWithoutStartingSlash = location.baseUrl.substr(1);
  const clearedPath = baseUrlWithoutStartingSlash.replace(/[\/,\.]/g, '_');  
  const digest = crypto.createHash('sha256').update(clearedPath).digest('hex')
  return `${!clearedPath ? 'home' : clearedPath.substring(0,200)}_${digest}.rule`;
    
}