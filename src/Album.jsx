import React, { useState, useEffect } from 'react'; //import react, useState, useEffect
import axios from 'axios';  //import axios
import './Album.css'; //import the CSS file

// function Album for the album manager

function Album() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [albumToUpdate, setAlbumToUpdate] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);


// useEffect to get the albums from the API

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/albums')
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


// useEffect to check if the albums are empty

  const handleAddAlbum = () => {
  if (title.trim() !== '') {
    axios.post('https://jsonplaceholder.typicode.com/albums', { title })
      .then(response => {
        setAlbums([response.data, ...albums]);
        setTitle('');
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    alert('Please enter a title for the album.');
  }
};
  


  const handleUpdateAlbum = (album) => {
    setAlbumToUpdate(album);
  };

  // useEffect to update the album

  const handleUpdateFormSubmit = (event) => {
    event.preventDefault();
    axios.put(`https://jsonplaceholder.typicode.com/albums/${albumToUpdate.id}`, albumToUpdate)
      .then(response => {
        const updatedAlbums = albums.map(album => {
          if (album.id === albumToUpdate.id) {
            return response.data;
          } else {
            return album;
          }
        });
        setAlbums(updatedAlbums);
        setAlbumToUpdate(null);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUpdateFormChange = (event) => {
    const updatedAlbum = { ...albumToUpdate, title: event.target.value };
    setAlbumToUpdate(updatedAlbum);
  };

  const handleCancelUpdate = () => {
    setAlbumToUpdate(null);
  };

  // useEffect to delete the album

  const handleShowDeleteConfirmation = (album) => {
    setAlbumToDelete(album);
  };

  const handleCancelDelete = () => {
    setAlbumToDelete(null);
  };

  // useEffect to confirm the delete

  const handleConfirmDelete = () => {
    axios.delete(`https://jsonplaceholder.typicode.com/albums/${albumToDelete.id}`)
      .then(response => {
        const updatedAlbums = albums.filter(album => album.id !== albumToDelete.id);
        setAlbums(updatedAlbums);
        setAlbumToDelete(null);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // return the album manager
  
  return (
    <div className="app-container">
      <h1 className="title">ALBUM MANAGER</h1>
      <hr />

      <div className="add-album-form">
        <input className="add-album-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Album title" />
        <button className="add-album-button" onClick={handleAddAlbum}>Add Album</button>
      </div>
      <br /><br /><br />
      <hr />
      <h1 className="title">Album Lists</h1>
      <ul className="album-list">
        {albums.map(album => (
          <li key={album.id} className="album-item">
            <span className="album-title">{album.title}</span>
            <div className="album-buttons">
              <button className="album-update-button" onClick={() => handleUpdateAlbum(album)}>Update</button>

              {albumToUpdate && albumToUpdate.id === album.id && (
                <div className="modal">
                <form className="modal-content update-form" onSubmit={handleUpdateFormSubmit}>
                  <input className="update-input updatein" type="text" value={albumToUpdate.title} onChange={handleUpdateFormChange} />
                  <div className="modal-buttons">
                    <button className="modbutt update-button" type="submit">Update</button>
                    <button className="modbutt2 update-button" onClick={handleCancelUpdate}>Cancel</button>
                  </div>
                </form>
              </div>
              )}
              <button className="album-delete-button" onClick={() => handleShowDeleteConfirmation(album)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

        

      {albumToDelete && (
        <div className="modal">
          <div className="modal-content">
            <p><b>Are you sure you want to delete this album?</b></p>
            <div className="modal-buttons">
              <button className='modbutt' onClick={handleConfirmDelete}>Delete</button>
              <button className='modbutt2' onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// export Album

export default Album;
