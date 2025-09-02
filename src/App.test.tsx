import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BenKon title', () => {
  render(<App />);
  const titleElement = screen.getByText(/BenKon/i);
  expect(titleElement).toBeInTheDocument();
});