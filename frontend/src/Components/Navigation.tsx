import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        navigate('login');
    };
    
    return (
        <nav className="">
            <ul className="flex">
                <li><Link to="">Home</Link></li>
                <li><Link to="documents">Documents</Link></li>
                <li><Link to="addnew">Add New</Link></li>
                {!isLoggedIn ? (
                    <>
                        <li><Link to="register">Register</Link></li>
                        <li><Link to="login">Login</Link></li>
                    </>
                ) : (
                    <li>
                        <Link to="" onClick={handleLogout}>Logout</Link>
                    </li>
                )}
                <li><Link to="userlist">UserList</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;