import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Server = () => {
  const [datas, setDatas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [edit, setEdit] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchServerData();
  }, []);

  const fetchServerData = () => {
    axios.get('http://localhost:3030/posts')
      .then(response => {
        console.log(response.data);
        setDatas(response.data);
      })
      .catch(error => console.log('Error:', error.message));
  };

  const handleFormSubmit = () => {
    if (edit) {
      const updatedItem = {
        title: newTitle,
        body: newBody,
      };

      axios.put(`http://localhost:3030/posts/${editItemId}`, updatedItem)
        .then(response => {
          console.log(' updated:', response.data);

          fetchServerData();

          setNewTitle('');
          setNewBody('');
          setEdit(false);
          setEditItemId(null);
          setShowForm(false);
        })
        .catch(error => console.log('Error:', error.message));
    } else {
      const newItem = {
        title: newTitle,
        body: newBody,
      };

      axios.post('http://localhost:3030/posts', newItem)
        .then(response => {
          console.log('added:', response.data);

          fetchServerData();

          setNewTitle('');
          setNewBody('');
          setShowForm(false);
        })
        .catch(error => console.log('Error:', error.message));
    }
  };

  const handleEditClick = (item) => {
    setEdit(true);
    setEditItemId(item.id);
    setNewTitle(item.title);
    setNewBody(item.body);
    setShowForm(true);
  };
  console .log("edit-item-id==",editItemId)


  const handleDeleteClick = (itemId) => {
    axios.delete(`http://localhost:3030/posts/${itemId}`)
      .then(response => {
        console.log('deleted:', response.data);
        fetchServerData();
      })
      .catch(error => console.log('Error:', error.message));
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    handleFormSubmit();
  }

  return (
    <div>
      <h1 className='ser-data'>Server Data</h1>
      <button onClick={() => setShowForm(true)} className='add-btn'>ADD</button>
       <div className='submit'>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </label>

          <label>
            Body:
            <textarea
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
            />
          </label>

          <button type="button" onClick={handleFormSubmit}>
            {edit ? 'Update' : 'Add'}
          </button>
        </form>
      )}
        </div>
      <ul>
        {datas.map(item => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <button onClick={() => handleEditClick(item)} className='edit-btn'>Edit</button>
            <button onClick={() => handleDeleteClick(item.id)} className='delete-btn'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Server;

