import { useContext, useRef, useState } from 'react';
import { BACKEND_URL } from '../../connSettings';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

function Login() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('You probably forgot to put <AuthProvider> in your component tree.');
    }

    const { login } = authContext; 
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    async function handleLogin() {
        if (emailInputRef.current && passwordInputRef.current) {
            const email = emailInputRef.current.value;
            const password = passwordInputRef.current.value;

            const query = `
            mutation($email: String!, $password: String!) {
                verifyUser(email: $email, password: $password) {
                    token
                    _id
                    email
                    role
                }
            }
             `;

            const variables = {
                email: email,
                password: password,
            };

            setLoading(true);
            setErrorMessage(null);

            console.log('Sending request with query:', query);
            console.log('With variables:', variables);

            const fetchData = async () => {
                const response = await fetch(`${BACKEND_URL}/graphql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables
                    })
                });
                return response;

            }

            try {
                const response = await fetchData();
                const result = await response.json();
                console.log(response)
                if (response.ok) {
                    if (result.data && result.data.verifyUser && result.data.verifyUser._id) {
                        login(result.data.verifyUser.token, result.data.verifyUser._id, result.data.verifyUser.email, result.data.verifyUser.role);
                        navigate('/documents');
                    } else {
                        setErrorMessage('Invalid login');
                        console.error("Authentication failed", result);
                    }
                } else {
                    if (response.status === 401) {
                        setErrorMessage('Unauthorized: Invalid email or password.');
                    } else {
                        setErrorMessage('An unexpected error occurred. Please try again later.');
                    }
                }
            } catch (error) {
                setErrorMessage('Connection issue: Unable to reach the server. Please check your internet connection.');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); 
            }
        } else {
            setErrorMessage('Please fill out both email and password.');
        }
    }

    return (
        <div>
            <h1>Access your documents</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} >
                <div>
                    <label htmlFor="email">Email</label>
                    <input ref={emailInputRef} type="email" id="email" autoComplete="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input ref={passwordInputRef} type="password" id="password" autoComplete="current-password" required />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>
    );
}

export default Login