import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
      setIsLoading(false);
    };
    fetchNotes();
  }, []);

  if (isLoading) {
    return <section className="loading">Loading</section>;
  }

  return (
    <main>
      <h1>
        Acme Notes ({notes.length})
      </h1>
      <ul>
        {notes.map(note => {
          return (
            <li key={note.id}>
              <h2>
                {note.firstname} {note.lastname}
              </h2>
              <p>
                {note.occupation}
              </p>
              <p>
                {note.service}
              </p>
              <p>
                {note.email}
              </p>
              <p>
                {note.phone}
              </p>
              <img src={note.photo_url} alt="photo" />
            </li>
          );
        })}
      </ul>
    </main>
  );
};

const root = createRoot(document.querySelector('#root'));

root.render(<App />);
