import { render, screen } from '@testing-library/react';

import Login from './Login';

beforeEach(() => {
    render(<Login />);
});

afterEach(() => {
    
});

it('renders the login form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
});