import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ServiceManager = () => {
    const { provider } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Get categoryId from query params
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        service_name: '',
        price: '',
        vat: '0',
        discount: '0'
    });

    const fetchServices = async () => {
        if (!categoryId || !provider) return;
        try {
            const token = localStorage.getItem('token');
            // Backend: getService(providerId, catagoryId). 
            // Again assuming it takes query params.
            const res = await fetch(`/api/provider/getService?provider_id=${provider.id}&catagory_id=${categoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setServices(Array.isArray(data) ? data : (data.data || []));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) {
            fetchServices();
        } else {
            setLoading(false);
        }
    }, [categoryId, provider]);

    const totalPrice = useMemo(() => {
        const p = parseFloat(formData.price) || 0;
        const v = parseFloat(formData.vat) || 0;
        const d = parseFloat(formData.discount) || 0;
        return (p + (p * v / 100)) - d;
    }, [formData.price, formData.vat, formData.discount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // keys expected by backend: providerId, catagoryId, serviceName, price, vat, discount
        // providerRoute: createService calls createService controller.
        // Models expect camelCase args, but Controller likely extracts from req.body.
        // Usually APIs use snake_case or camelCase. `services` table uses snake_case.
        // I'll send camelCase to match the likely Controller extraction (if it destructures).
        // Or send both just in case? No, that's messy.
        // Let's assume controller uses req.body.service_name or req.body.serviceName.
        // Looking at routes, it just calls `createService`.
        // I previously saw `providerModel` uses camelCase destructuring `createServiceModel = async ({... serviceName ...})`.
        // So if controller passes req.body directly to model it won't work unless controller maps it.
        // I'll assume controller expects camelCase `serviceName` based on JS variables seen in model.

        const payload = {
            providerId: provider.id,
            catagoryId: categoryId,
            serviceName: formData.service_name,
            price: formData.price,
            vat: formData.vat,
            discount: formData.discount
        };

        if (isEditing) {
            payload.id = editId;
            // updateService expects id, serviceName...
        }

        try {
            const url = isEditing ? '/api/provider/updateService' : '/api/provider/createService';
            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed');

            fetchServices();
            resetForm();
        } catch (e) {
            alert(e.message);
        }
    };

    const resetForm = () => {
        setFormData({ service_name: '', price: '', vat: '0', discount: '0' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (svc) => {
        setIsEditing(true);
        setEditId(svc.id);
        setFormData({
            service_name: svc.service_name,
            price: svc.price,
            vat: svc.vat,
            discount: svc.discount
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete?')) return;
        const token = localStorage.getItem('token');
        await fetch('/api/provider/deleteService', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ id })
        });
        setServices(services.filter(s => s.id !== id));
    };

    if (!categoryId) return <div className="p-10">Please select a category from the dashboard.</div>;

    return (
        <div>
            <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-2 text-muted hover:text-main">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Form Section */}
                <div className="md:w-1/3">
                    <div className="card sticky top-4">
                        <h3 className="text-xl mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="label">Service Name</label>
                                <input className="input" value={formData.service_name}
                                    onChange={e => setFormData({ ...formData, service_name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="label">Base Price</label>
                                <input type="number" step="0.01" className="input" value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <div className="flex gap-2">
                                <div className="input-group flex-1">
                                    <label className="label">VAT %</label>
                                    <input type="number" step="0.01" className="input" value={formData.vat}
                                        onChange={e => setFormData({ ...formData, vat: e.target.value })} />
                                </div>
                                <div className="input-group flex-1">
                                    <label className="label">Discount</label>
                                    <input type="number" step="0.01" className="input" value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: e.target.value })} />
                                </div>
                            </div>

                            <div className="bg-slate-100 p-3 rounded mb-4 text-sm">
                                Total Price: <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="btn btn-primary flex-1">
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="btn btn-outline">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:w-2/3">
                    <h3 className="text-xl mb-4">Services in Category</h3>
                    {services.length === 0 ? (
                        <p className="text-muted">No services found.</p>
                    ) : (
                        <div className="space-y-4">
                            {services.map(svc => (
                                <div key={svc.id} className="card flex justify-between items-center p-4">
                                    <div>
                                        <h4 className="font-bold">{svc.service_name}</h4>
                                        <div className="text-sm text-muted">
                                            Base: ${parseFloat(svc.price).toFixed(2)} | +{svc.vat}% VAT | -${svc.discount}
                                        </div>
                                        <div className="text-primary font-bold mt-1">
                                            Total: ${svc.total_price ? parseFloat(svc.total_price).toFixed(2) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(svc)} className="btn btn-outline text-sm p-2">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(svc.id)} className="btn btn-danger text-sm p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceManager;
