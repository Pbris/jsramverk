import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../connSettings';


function Registration() {
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function handleRegistration() {
        if (emailInputRef.current && passwordInputRef.current) {
            const email = emailInputRef.current.value;
            const password = passwordInputRef.current.value;
            
            const query = `
            mutation($email: String!, $password: String!) {
                addUser(email: $email, password: $password) {
                    email
                }
            }
             `;

            const variables = {
                email: email,
                password: password,
            };

            setLoading(true);
            setErrorMessage(null);

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
                
                if (response.ok) {
                    if (result.data && result.data.addUser && result.data.addUser.email) {
                        navigate('/userlist');
                    } else {
                        console.error('Error fetching data:', result.errors);
                        setErrorMessage(result.errors[0].message);
                    }
                } else {
                    if (response.status === 401) {
                        console.error('Error fetching data:', result.errors);
                        setErrorMessage('Unauthorized: Invalid email or password.');
                    } else {
                        console.error('Error fetching data:', result.errors);
                        setErrorMessage('An unexpected error occurred. Please try again later.');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Error fetching data');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Missing form data');
        }
    }

    return (
        <div>
            <h1>Registration</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleRegistration(); }}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input ref={emailInputRef} type="email" id="email" autoComplete="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input ref={passwordInputRef} type="password" id="password" autoComplete="new-password" required />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;