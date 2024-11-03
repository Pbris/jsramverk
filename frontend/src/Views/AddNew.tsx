import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../connSettings';
import { useNavigate } from 'react-router-dom';


function AddNew() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const submitForm = async () => {
            if (submit) {
                const token = localStorage.getItem('token');
                await fetch(`${BACKEND_URL}/api/add_new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }),
                    },
                    body: JSON.stringify({ title, content }),
                });

                setSubmit(false);
                navigate("/documents");
            }
        }
        submitForm();
    }, [submit, content, navigate, title])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Reset error message
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required.');
            return;
        }

        setSubmit(true);
    }

    return (
        <>
            <h2>Dokument</h2>
            <form onSubmit={(e) => handleSubmit(e)} className="new-doc" method="POST">
                <label htmlFor="title">Titel</label>
                <input type="text" name="title" id="title-text" onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="content">Innehåll</label>
                <textarea name="content" id="content-text" onChange={(e) => setContent(e.target.value)} ></textarea>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <input type="submit" value="Lägg till" disabled={submit} />
            </form>
        </>
    );
}

export default AddNew;