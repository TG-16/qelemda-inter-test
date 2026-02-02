import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CategoryManager = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provider } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active',
        image: null
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if editing
        if (location.state && location.state.category) {
            const cat = location.state.category;
            setIsEditing(true);
            setFormData({
                id: cat.id,
                title: cat.title,
                description: cat.description,
                status: cat.status,
                image: null // Can't preset file input
            });
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('status', formData.status);

            if (provider) {
                data.append('providerId', provider.id);
            }

            if (formData.image) {
                data.append('image', formData.image);
            }
            if (isEditing) {
                data.append('id', formData.id);
            }

            // Note: Backend might expect provider_id in body? 
            // providerModel createCatagoryModel takes providerId.
            // Usually extracted from token, but if not, might need to append.
            // I'll rely on token.

            const url = isEditing ? '/api/provider/updateCatagory' : '/api/provider/createCatagory';
            const method = isEditing ? 'PATCH' : 'POST';
            // Note: createCatagory uses upload.single so consumes multipart.
            // updateCatagory usually just JSON but if updating image it needs multipart.
            // Route router.patch("/updateCatagory", updateCatagory); doesn't have upload middleware in routes/providerRoute.js!
            // This means update might not support image update or expects JSON.
            // I will send JSON for update if no image, but the form handles both.
            // If update is JSON-only, I should use JSON.
            // Checking routes again: `router.post("/createCatagory", upload.single("image")...)`
            // `router.patch("/updateCatagory", updateCatagory);` (No multer)
            // So update does NOT support file upload in current backend code.
            // I will implement accordingly (only text fields for update).

            const headers = { 'Authorization': `Bearer ${token}` };
            let body;

            if (isEditing) {
                body = JSON.stringify({
                    id: formData.id,
                    title: formData.title,
                    description: formData.description,
                    status: formData.status
                });
                headers['Content-Type'] = 'application/json';
            } else {
                // Create uses FormData
                body = data;
            }

            const response = await fetch(url, {
                method,
                headers,
                body
            });

            if (!response.ok) {
                const resJson = await response.json();
                throw new Error(resJson.message || 'Operation failed');
            }

            navigate('/dashboard');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-2 text-muted hover:text-main">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="card">
                <h2 className="text-2xl mb-6">{isEditing ? 'Edit Category' : 'Create New Category'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="label">Category Title</label>
                        <input name="title" className="input" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">Description</label>
                        <textarea name="description" className="input" value={formData.description} onChange={handleChange} rows="3" />
                    </div>

                    {!isEditing && (
                        <div className="input-group">
                            <label className="label">Icon / Image</label>
                            <input type="file" name="image" className="input" onChange={handleChange} accept="image/*" />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="label">Status</label>
                        <select name="status" className="input" value={formData.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryManager;
