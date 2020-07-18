import { TracingStrategy } from '../tracingStrategy';
import { PermissionsProvider } from './PermissionsContext';
import ExportStack from './ExportStack';
import { subscribeToExposureEvents, getCurrentExposures } from './exposureInfo';
import { useGPSCopyContent, gpsAssets } from './content';
import { ExposureEventsStrategy } from '../ExposureHistoryContext';
import { toExposureHistory } from './intersect/exposureHistory';

const gpsExposureEventContext: ExposureEventsStrategy = {
  exposureInfoSubscription: subscribeToExposureEvents,
  toExposureHistory: toExposureHistory,
  getCurrentExposures: getCurrentExposures,
};

const gpsStrategy: TracingStrategy = {
  name: 'gps',
  exposureEventsStrategy: gpsExposureEventContext,
  permissionsProvider: PermissionsProvider,
  homeScreenComponent: () => {},
  affectedUserFlow: ExportStack,
  assets: gpsAssets,
  useCopy: useGPSCopyContent,
};

export default gpsStrategy;
