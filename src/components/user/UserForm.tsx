import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName } from '../../actions/userActions';

const UserForm = ({ setUserName }) => {
    const [name, setName] = useState('');
    const userName = useSelector(state => state.userName);
    const dispatch = useDispatch();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(setUserName(name));
        setName(''); // Clear the input field after submission
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={name} onChange={handleNameChange} />
            <button type="submit">Set Name</button>
        </form>
    );
};

export default UserForm;