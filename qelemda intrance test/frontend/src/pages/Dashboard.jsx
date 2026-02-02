import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

const Dashboard = () => {
    const { provider } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

 const fetchCategories = async () => {
  try {
    const response = await fetch(
      `/api/provider/getCatagory?providerId=${provider.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}` // optional but good
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    setCategories(Array.isArray(data) ? data : data.data || []);
  } catch (err) {
    console.error(err);
    setError("Could not load categories.");
  } finally {
    setLoading(false);
  }
};


    useEffect(() => {
        fetchCategories();
    }, [provider]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/provider/deleteCatagory', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (e) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">My Service Categories</h1>
                <div className="flex gap-2">
                    <a href={`/services/${provider?.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">
                        <ExternalLink size={18} /> View Public Page
                    </a>
                    <Link to="/categories" className="btn btn-primary">
                        <Plus size={18} /> Add Category
                    </Link>
                </div>
            </div>

            {error && <div className="text-danger mb-4">{error}</div>}

            {categories.length === 0 ? (
                <div className="text-center p-10 bg-white rounded border border-dashed border-gray-300">
                    <p className="text-muted mb-4">You haven't added any categories yet.</p>
                    <Link to="/categories" className="btn btn-primary">Create First Category</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Note: grid classes won't work unless I have Tailwind or defined them, I defined some utilities but not grid system fully.
                I will add grid to index.css or use flex. I'll stick to simple flex wrap for safety or add grid to clean css.
             */}
                    <div className="flex flex-wrap gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', width: '100%' }}>
                        {categories.map((cat) => (
                            <div key={cat.id} className="card flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl">{cat.title}</h3>
                                        <span className={`text-sm px-2 py-1 rounded ${cat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                            {cat.status}
                                        </span>
                                    </div>
                                    <p className="text-muted text-sm mb-4">{cat.description}</p>
                                    {/* Image display if available. cat.icon is BLOB? or URL? Schema says LONGBLOB. 
                    If BLOB, need to convert to Base64 or URL. 
                    If backend sends base64, good. If buffer, frontend needs to handle.
                    Assuming backend returns URL or base64 string.
                */}
                                </div>
                                <div className="flex justify-between items-center mt-4 border-t pt-4">
                                    <Link to={`/categories?edit=${cat.id}`} state={{ category: cat }} className="btn btn-outline text-sm">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <Link to={`/services?categoryId=${cat.id}`} className="text-primary hover:underline text-sm font-medium">
                                        Manage Services
                                    </Link>
                                    <button onClick={() => handleDelete(cat.id)} className="text-danger hover:underline">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
