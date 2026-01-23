import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, Loader, Database, Mic, Music, PlayCircle } from 'lucide-react';
import api from '../api';
import SearchableSelect from '../components/SearchableSelect';

const EditItem = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form fields
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchItem();
    }, [type, id]);

    const fetchItem = async () => {
        setLoading(true);
        setError(null);
        try {
            let endpoint = '';
            if (type === 'songs') endpoint = `/songs/${id}`;
            else if (type === 'albums') endpoint = `/albums/${id}`;
            else if (type === 'artists') endpoint = `/artists/${id}`;
            else if (type === 'playlists') endpoint = `/playlists/${id}`;

            const res = await api.get(endpoint);
            const d = res.data;

            // Initialize form data
            if (type === 'songs') {
                setFormData({
                    title: d.title,
                    album: d.album ? { id: d.album.id, name: d.album.title } : null,
                    artists: d.artists ? d.artists.map(a => ({
                        id: a.id,
                        name: a.name,
                        identifier: a.identifiers?.[0]?.identifier // Best effort
                    })) : []
                });
            } else if (type === 'albums') {
                setFormData({ title: d.title });
            } else if (type === 'artists') {
                setFormData({ name: d.name });
            } else if (type === 'playlists') {
                setFormData({ name: d.name });
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load item. " + (e.response?.data?.error || e.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let endpoint = '';
            let payload = {};

            if (type === 'songs') {
                endpoint = `/songs/${id}`;

                const artists = (formData.artists || []).map(a => ({
                    name: a.name,
                    identifier: a.identifier || a.sub || (a.name ? a.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') : 'unknown')
                }));

                payload = {
                    title: formData.title,
                    album_title: formData.album?.name || '',
                    artists: artists
                };
            } else if (type === 'albums') {
                endpoint = `/albums/${id}`;
                payload = { title: formData.title };
            } else if (type === 'artists') {
                endpoint = `/artists/${id}`;
                payload = { name: formData.name };
            } else if (type === 'playlists') {
                endpoint = `/playlists/${id}`; // Global endpoint
                payload = { name: formData.name };
            }

            await api.put(endpoint, payload);
            navigate(-1);
        } catch (e) {
            console.error(e);
            alert("Failed to save: " + (e.response?.data?.error || e.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        setSaving(true);
        try {
            let endpoint = `/${type}/${id}`;
            if (type === 'songs') endpoint = `/songs/${id}`;
            if (type === 'playlists') endpoint = `/playlists/${id}`;

            await api.delete(endpoint);
            navigate(-1);
        } catch (e) {
            console.error(e);
            alert("Failed to delete: " + (e.response?.data?.error || e.message));
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-full items-center justify-center text-primary">
            <Loader className="animate-spin w-8 h-8" />
        </div>
    );

    if (error) return (
        <div className="p-10 text-center">
            <h2 className="text-red-500 mb-4 font-bold">Error</h2>
            <p className="text-white/60 mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded">
                Go Back
            </button>
        </div>
    );

    const getIcon = () => {
        if (type === 'songs') return Music;
        if (type === 'albums') return Database;
        if (type === 'artists') return Mic;
        return Database;
    };
    const Icon = getIcon();

    return (
        <main className="flex-1 overflow-auto grid-bg p-6 flex flex-col gap-6 animate-slide-in">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-[0.1em] flex items-center gap-3">
                        <Icon className="w-6 h-6 text-primary" /> Edit {type.slice(0, -1).toUpperCase()}
                    </h2>
                    <p className="text-[10px] text-white/40 font-mono mt-1">ID: {id}</p>
                </div>
            </div>

            <div className="max-w-2xl flex flex-col gap-6">
                {/* Dynamic Form */}
                {type === 'songs' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Title</label>
                            <input
                                className="bg-black/40 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <SearchableSelect
                            label="Album"
                            type="album"
                            value={formData.album}
                            onChange={val => setFormData({ ...formData, album: val })}
                            placeholder="Search for album..."
                        />
                        <SearchableSelect
                            label="Artists"
                            type="artist"
                            multiple={true}
                            value={formData.artists}
                            onChange={val => setFormData({ ...formData, artists: val })}
                            placeholder="Search and select artists..."
                        />
                    </>
                )}

                {(type === 'albums' || type === 'artists' || type === 'playlists') && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Name/Title</label>
                        <input
                            className="bg-black/40 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors"
                            value={formData.title || formData.name || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="px-6 py-3 bg-red-500/10 text-red-500 font-bold text-xs tracking-widest flex items-center gap-2 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> DELETE
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-primary text-black font-bold text-xs tracking-widest flex items-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                    >
                        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE CHANGES
                    </button>
                </div>
            </div>
        </main>
    );
};

export default EditItem;
