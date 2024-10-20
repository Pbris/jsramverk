import { useRef, useEffect } from 'react';
// import bcrypt from 'bcryptjs';
import { BACKEND_URL } from '../../connSettings';


function Registration() {
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);

    // consider implementing try / catch block
    async function handleRegistration() {
        if (emailInputRef.current && passwordInputRef.current) {
            const email = emailInputRef.current.value;
            const password = passwordInputRef.current.value;
            // const hashedPassword = await bcrypt.hash(password, 10);
            // moving to server side hashing

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
                    if (result.data && result.data.addUser) {
                        console.log(result.data.addUser);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                console.log('fetchData() completed');
            }
            fetchData();
            alert(`Successfully registered with email ${email} and password ${password}`);
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;