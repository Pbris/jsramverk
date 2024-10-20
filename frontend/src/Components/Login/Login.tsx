import { useRef } from 'react';
import { BACKEND_URL } from '../../connSettings';

function Login(){
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);

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
                }
            }
             `;

            const variables = {
                email: email,
                password: password,
            };

            console.log('Sending request with query:', query);
            console.log('With variables:', variables);

            const fetchData = async () => {
                try {
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
                    const result = await response.json();
                    if (result.data && result.data.verifyUser && result.data.verifyUser._id) {
                        console.log(result.data.verifyUser._id);
                        localStorage.setItem('token', result.data.verifyUser.token);
                    } else {
                        console.error("Authentication failed:", result.errors);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            fetchData();
        } else {
            alert('Missing form data');
        }
    }

    return(
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
            <button>Login</button>
            </form>
        </div>
    );
}

export default Login