import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if(!authContext) {
        throw new Error('You probably forgot to put <AuthProvider> in your component tree.');
    }

    const { isLoggedIn, logout } = authContext; 

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="">
            <ul className="flex">
                <li><a href="/">Home</a></li>
                <li><a href="/documents">Documents</a></li>
                <li><a href="/addnew">Add New</a></li>
                <li><a href="/register">Register</a></li>
                {!isLoggedIn ? (
                    <>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/login">Login</a></li>
                    </>
                ) : (
                    <li><a href="/" onClick={handleLogout}>Logout</a></li>
                )}
                <li><a href="/userlist">UserList</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;