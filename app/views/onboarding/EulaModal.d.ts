import { FunctionComponent } from 'react';

import { eulaModal } from './EulaModal';

interface EulaModalProps {
  continueFunction: () => void;
  selectedLocale: string;
}

export const EulaModal: FunctionComponent<EulaModalProps> = eulaModal;
