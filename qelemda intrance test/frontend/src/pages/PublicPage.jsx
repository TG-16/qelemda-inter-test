import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PublicPage = () => {
    const { slug } = useParams();
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Request Modal State
    const [selectedService, setSelectedService] = useState(null);
    const [requestForm, setRequestForm] = useState({
        name: '', email: '', phone: '', message: ''
    });
    const [requestStatus, setRequestStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assumed Endpoint: /api/public/provider/:slug
                // This endpoint should return { provider: {...}, categories: [ {..., services: [...] } ] }
                // OR separate calls.
                const res = await fetch(`/api/public/provider/${slug}`);
                if (!res.ok) throw new Error('Provider not found');
                const data = await res.json();
                setProviderData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/public/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_item_id: selectedService.id,
                    customer_name: requestForm.name,
                    customer_email: requestForm.email,
                    customer_phone: requestForm.phone,
                    message: requestForm.message
                })
            });
            if (res.ok) {
                setRequestStatus('Request sent successfully!');
                setTimeout(() => {
                    setSelectedService(null);
                    setRequestStatus('');
                    setRequestForm({ name: '', email: '', phone: '', message: '' });
                }, 2000);
            } else {
                throw new Error('Failed to send request');
            }
        } catch (e) {
            alert('Error sending request');
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-danger">{error}</div>;
    if (!providerData) return null;

    const { provider, categories } = providerData;
    // Adjusted destructuring based on assumed API response structure.
    // If API returns flat categories or different structure, this needs adjustment.

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow py-6">
                <div className="container text-center">
                    <h1 className="text-3xl font-bold text-primary">{provider.company_name}</h1>
                    <p className="text-muted mt-2">{provider.full_name} | {provider.email} | {provider.phone}</p>
                </div>
            </header>

            <main className="container py-8">
                <div className="space-y-8">
                    {categories?.map(cat => (
                        <section key={cat.id}>
                            <div className="flex items-center gap-3 mb-4 border-b pb-2">
                                {/* icon handling if needed */}
                                <h2 className="text-2xl font-semibold">{cat.title}</h2>
                            </div>
                            <p className="text-muted mb-4">{cat.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cat.services?.map(svc => (
                                    <div key={svc.id} className="card hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{svc.service_name}</h3>
                                            <span className="text-primary font-bold">
                                                ${svc.total_price ? parseFloat(svc.total_price).toFixed(2) : svc.price}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted mt-2">
                                            {svc.description}
                                        </div>
                                        <button
                                            onClick={() => setSelectedService(svc)}
                                            className="btn btn-primary w-full mt-4"
                                        >
                                            Request Service
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Request Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Request Service: {selectedService.service_name}</h3>

                        {requestStatus ? (
                            <div className="text-green-600 font-bold text-center py-4">{requestStatus}</div>
                        ) : (
                            <form onSubmit={handleRequestSubmit}>
                                <div className="input-group">
                                    <label className="label">Your Name</label>
                                    <input className="input" required
                                        value={requestForm.name} onChange={e => setRequestForm({ ...requestForm, name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="label">Email</label>
                                    <input type="email" className="input"
                                        value={requestForm.email} onChange={e => setRequestForm({ ...requestForm, email: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="label">Phone</label>
                                    <input type="tel" className="input"
                                        value={requestForm.phone} onChange={e => setRequestForm({ ...requestForm, phone: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="label">Message (Optional)</label>
                                    <textarea className="input" rows="3"
                                        value={requestForm.message} onChange={e => setRequestForm({ ...requestForm, message: e.target.value })} />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary flex-1">Submit Request</button>
                                    <button type="button" onClick={() => setSelectedService(null)} className="btn btn-outline">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicPage;
