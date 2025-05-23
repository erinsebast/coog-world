import { useState, useEffect } from "react";

export function UpdateTicket({isOpen, onClose, ticketToEdit, onUpdateTicket}){
    const [formData, setFormData] = useState({
        ticket_type: '',
        price: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    useEffect(() => {
        if(ticketToEdit){
            setFormData({
                ticket_type: ticketToEdit.ticket_type || '',
                price: ticketToEdit.price || '',
            });
        }
    }, [ticketToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/ticket-type/${ticketToEdit.ticket_id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Ticket updated successfully!', error: ''});
                if(onUpdateTicket){
                    onUpdateTicket();
                    setMessage({success: 'Ticket updated successfully!', error: ''});
                    setTimeout(() => {onClose();}, 1000);
                }
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating the ticket.', success: ''});
        }
    };
    if(!isOpen || !ticketToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'ticket_type': 'e.g. Day Pass',
            'price': 'e.g. 100'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Ticket #{ticketToEdit.ticket_id}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['ticket_type', 'price'].map((field) => (
                            <div className="modal-input-group">
                                <label htmlFor={field}>
                                    {field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input id={field} type={field === 'price' ? 'number' : 'text'} name={field} required autoComplete="off" value={formData[field]} onChange={handleInputChange} placeholder={getPlaceholders(field)} />
                            </div>
                        ))}
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Ticket</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddTicket({isOpen, onClose, onAddTicket}){
    const [newTicket, setNewTicket] = useState({
        ticket_type: '',
        price: ''
    });
    const [message, setMessage] = useState({error: '', success: ''});
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewTicket({...newTicket, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!ticket_type || !price){
            setMessage({error: 'All fields are required!', success: ''});
            return;
        }
        if(isNaN(newTicket.price)){
            setMessage({error: 'Price must be a number.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/ticket-type/create-ticket', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newTicket),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'New Ticket added successfully!', error: ''});
                setNewTicket({
                    ticket_type: '', 
                    price: '',
                });
                onAddTicket(data.ticket);
                onClose();
            } else {
                setMessage({error: data.message || 'Failed to add new ticket.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'ticket_type': 'e.g. Day Pass',
            'price': 'e.g. 100'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Ticket</h2>
                <form onSubmit={handleSubmit}>
                    {['ticket_type', 'price'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field === 'ticket_type' ? 'Ticket Type' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field}
                            type={field === 'price' ? 'number' : 'text'}
                            name={field}
                            required
                            autoComplete="off"
                            value={newTicket[field]}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders(field)} />
                        </div>
                    ))}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Ticket</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTicket;