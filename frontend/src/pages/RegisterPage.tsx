import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import config from '../../backend.config.json';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();}