import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import SakuraPetal from './SakuraPetal';

describe('SakuraPetal', () => {
  it('renders without crashing', () => {
    render(<SakuraPetal />);
  });
});
