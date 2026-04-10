import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { useState, useEffect } from 'react';
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

    const fetchPresentations =async () =>{
        try{
            const store =await getStore();
            setPresentations(store.presentations);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        }
    };

    useEffect(() => {fetchPresentations()},[]);

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

    const handleThumbnailFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
            }}>
                {presentations.map((presentation) => (
                    <div 
                        key={presentation.id} 
                        onClick={() => navigate(`/presentation/edit?id=${presentation.id}`)}
                        style={{
                        aspectRatio: '2 / 1',
                        minWidth: '100px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '12px',
                        gap: '12px',
                        backgroundColor: '#1e1e1e',
                        }}>
                        {presentation.thumbnail ? (
                            <img 
                            src={presentation.thumbnail} 
                            alt={presentation.name} 
                            style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            flexShrink: 0,
                            }} /> ):(
                            <div style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#333',
                                borderRadius: '4px',
                                flexShrink: 0,
                            }} />
                        )}
                        <div style={{ overflow: 'hidden'}}>
                            <strong style ={{ display: 'block', marginBottom:'4px'}}>{presentation.name}</strong>
                            {presentation.description && (<p style={{ fontSize: '0.8em', margin: '0 0 4px 0', color: '#ccc'}}>
                                {presentation.description}</p>)}
                            <p style={{ fontSize: '0.75em', margin: 0, color: '#aaa'}}>
                                {presentation.slides.length} {presentation.slides.length === 1 ? 'slide' : 'slides'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        minWidth: '380px',
                        color: '#000',
                    }}>
                        <h3>Create New Presentation</h3>
                        <div style={{ marginBottom: '12px' }}>
                             <label style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
                            <input type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>Description:</label>
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px' }}>Thumbnail:</label>
                            <input type="file" accept="image/*" onChange={handleThumbnailFile} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                                setShowCreateModal(false);
                                setNewName('');
                                setNewDescription('');
                                setNewThumbnail('');
                            }}>
                              Cancel
                            </button>
                            <button onClick={handleCreate} disabled={!newName.trim()}>Create</button>
                        </div>
                    </div>
                </div>
            )}
            <ErrorPopup message={error} onClose={() => setError('')} />
        </div>
    );
};

export default Dashboard;