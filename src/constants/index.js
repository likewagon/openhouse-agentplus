import CustomColors from './Colors';
import DefinedImages from './Images';
import {isUserSubscriptionActive as definedIsUserSubscriptionActive} from './Util';
import {watchdogTimer as definedWatchdogTimer} from './Util';

export const Colors = CustomColors;
export const Images = DefinedImages;
export const isUserSubscriptionActive = definedIsUserSubscriptionActive;
export const watchdogTimer = definedWatchdogTimer;

export const LoginInfo = {}

export const RouteParam = {
  deviceType: 'phone',  
  verifyResult: {},    
  liveCallFromBackgroundNotification: false,
  propertyRecordNo: '', 
  propertyMainPhotoUrl: '', 
  propertyAgentFullname: '',      
  liveInfo: {},  
}
