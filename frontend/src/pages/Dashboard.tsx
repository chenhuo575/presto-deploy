import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { useState, useEffect, type ChangeEvent  } from 'react';
import config from '../../backend.config.json';
import { getStore, putStore } from '../api';
import type { Presentation, Slide } from '../types';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [newName, setNewName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');
  const navigate = useNavigate();

  const fetchPresentations = async () => {
    try {
      const store = await getStore();
      setPresentations(store.presentations ?? []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {fetchPresentations()},[]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:${config.BACKEND_PORT}/admin/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCreate = async () => {
    try {
      const store = await getStore();
      const existingPresentations = store.presentations ?? [];
      const defaultSlide: Slide = {
        id: `slide-${Date.now()}`,
        elements: [],
      };
      const newPresentation: Presentation = {
        id: `pres-${Date.now()}`,
        name: newName || 'Untitled Presentation',
        description: newDescription,
        thumbnail: newThumbnail,
        slides: [defaultSlide],
      };
      const updated = {
        ...store,
        presentations: [...existingPresentations, newPresentation],
      };
      await putStore(updated);
      setPresentations(updated.presentations);
      setShowCreateModal(false);
      setNewName('');
      setNewDescription('');
      setNewThumbnail('');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleThumbnailFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <button onClick={() => setShowCreateModal(true)}>Create New Presentation</button>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '20px',
      }}>
        {presentations.map((pres) => (
          <div
            key={pres.id}
            onClick={() => navigate(`/presentation/${pres.id}`)}
            style={{
              flex: '1 1 250px',
              minWidth: '100px',
              maxWidth: '400px',
              aspectRatio: '2 / 1',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#1a1a1a',
            }}
          >
            {pres.thumbnail ? (
              <img
                src={pres.thumbnail}
                alt={pres.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
              />
            ) : (
              <div style={{ width: '50px', height: '50px', backgroundColor: 'grey', borderRadius: '4px' }} />
            )}
            <div>
              <strong>{pres.name}</strong>
              {pres.description && <p style={{ fontSize: '0.8em', margin: '4px 0' }}>{pres.description}</p>}
              <p style={{ fontSize: '0.75em', color: '#aaa' }}>{pres.slides.length} slide(s)</p>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', minWidth: '350px', color: '#000' }}>
            <h3>Create New Presentation</h3>
            <div style={{ marginBottom: '12px' }}>
              <label>Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Description:</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Thumbnail:</label>
              <input type="file" accept="image/*" onChange={handleThumbnailFile} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
      <ErrorPopup message={error} onClose={() => setError('')} />
    </div>
  );
};

export default Dashboard;