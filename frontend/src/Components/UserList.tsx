import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../connSettings';

interface User {
    _id: string;
    email: string;
    hashedPassword: string;
}

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const fetchData = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: "{ users { _id email hashedPassword } }" })
            });
            const result = await response.json();
            if (result.data && result.data.users && result.data.users.length > 0) {
                setUsers(result.data.users);
                console.log(result.data.users);
                console.log(result);
                console.log("there is data...")
            } else {
                setUsers([
                    {
                        _id: "0",
                        email: "No users found",
                        hashedPassword: "No users found"
                    }
                ]);
            }
            console.log(users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div>
            <h1>Users</h1>
            <ul>
            {users.map(user => (
                    <li key={user._id}>
                        {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;