import { render, screen } from '@testing-library/react';

import Registration from './Registration';

beforeEach(() => {
 
});

it('renders the registration form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
});