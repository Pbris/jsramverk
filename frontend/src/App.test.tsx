import {render} from '@testing-library/react';
import { screen } from '@testing-library/react';
import App from './App';

describe('navigation links', () => {
  beforeEach(() => {
    render(<App />);
  });
  test('renders home link', () => {
    const linkElement = screen.getByText(/home/i);
    expect(linkElement).toBeInTheDocument();
  });
  test('renders list link', () => {
    const linkElement = screen.getByText("List");
    expect(linkElement).toBeInTheDocument();
  });
  test('renders add new link', () => {
    const linkElement = screen.getByText(/AddNew/i);
    expect(linkElement).toBeInTheDocument();
  });
  test('renders login-link', () => {
    const linkElement = screen.getByText(/login/i);
    expect(linkElement).toBeInTheDocument();
  });
  test('renders register-link', () => {
    const linkElement = screen.getByText(/register/i);
    expect(linkElement).toBeInTheDocument();
  });
});
