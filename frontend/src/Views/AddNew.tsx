import {useState, useEffect} from 'react';
import { BACKEND_URL } from '../connSettings';


type AddNewProps = {
    setView: React.Dispatch<React.SetStateAction<string>>;
}


function AddNew( {setView} : AddNewProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        const submitForm = async () => {
        if (submit) {
            await fetch(`${BACKEND_URL}/api/add_new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content }),
                });

                setSubmit(false);
                setView("List")
            }
        }
        submitForm();
    },[submit, title, content, setView])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>){
            event.preventDefault();
            setSubmit(true);
            let titleElement = document.getElementById("title-text") as HTMLInputElement | null
            const titleText = titleElement?.value ?? "";
            setTitle(t => t = titleText);

            let contentElement = document.getElementById("content-text") as HTMLTextAreaElement | null;
            const contentText = contentElement?.value ?? "";
            setContent(c => c = contentText);
    }

    return (
        <>
        <h2>Dokument</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="new-doc" method="POST">
            <label htmlFor="title">Titel</label>
                <input type="text" name="title" id="title-text"/>
                <label htmlFor="content">Innehåll</label>
                <textarea name="content" id="content-text"></textarea>
            <input type="submit" value="Lägg till" disabled={submit}/>
        </form>
        </>
      );
}

export default AddNew;