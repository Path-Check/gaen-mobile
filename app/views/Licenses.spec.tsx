import React from 'react';
import 'react-native';
import { render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import LicensesScreen from './Licenses';

jest.mock('@react-navigation/native');
(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() });

describe('LicensesScreen', () => {
  it('displays PathCheck BT', () => {
    const { getByTestId } = render(<LicensesScreen />);

    expect(getByTestId('licenses-legal-header')).toHaveTextContent(
      'PathCheck BT',
    );
  });
});
