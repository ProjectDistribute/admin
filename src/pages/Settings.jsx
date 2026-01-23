import React, { useState } from 'react';
import { CornerBrackets, GlowBorders } from '../components/FUI';
import { Shield, Key, Server, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';
import api from '../api';

const SettingsView = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // Not verified by API in this simplified endpoint, but UI has field
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            await api.put(`/users/${user.id}/password`, { password });
            setMsg('SUCCESS: CREDENTIALS UPDATED');
            setPassword('');
            setCurrentPassword('');
        } catch (e) {
            setMsg('ERROR: ' + (e.response?.data?.error || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto grid-bg p-6 flex flex-col gap-6 animate-slide-in">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-[0.1em] flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" /> SETTINGS
                </h2>
                <p className="text-[10px] text-white/40 font-mono mt-1">System configuration and personal security.</p>
            </div>

            <div className="flex gap-4 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-1 text-xs font-bold tracking-widest transition-colors ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
                >
                    SECURITY
                </button>
                <button
                    onClick={() => setActiveTab('general')}
                    className={`pb-3 px-1 text-xs font-bold tracking-widest transition-colors ${activeTab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
                >
                    GENERAL
                </button>
            </div>

            <div className="panel p-8 relative max-w-2xl">
                <CornerBrackets />

                {activeTab === 'security' && (
                    <div className="space-y-8 animate-slide-in">
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <Key className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">CHANGE PASSWORD</h3>
                                <p className="text-[10px] text-white/40 font-mono">Ensure a strong password sequence.</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                            <div className="space-y-1">
                                <label className="text-[10px] text-primary font-bold tracking-widest block">NEW PASSCODE</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-3 text-white text-xs focus:border-primary focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            {msg && (
                                <div className={`text-[10px] font-mono p-2 border ${msg.startsWith('ERROR') ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-primary/30 text-primary bg-primary/10'}`}>
                                    {msg}
                                </div>
                            )}

                            <button disabled={loading} className="bg-primary/10 border border-primary/30 text-primary px-6 py-3 font-bold text-xs hover:bg-primary hover:text-black transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> {loading ? 'UPDATING...' : 'UPDATE CREDENTIALS'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="space-y-8 animate-slide-in">
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10">
                            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                                <Server className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">SERVER CONFIGURATION</h3>
                                <p className="text-[10px] text-white/40 font-mono">Manage instance parameters.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 border border-white/5">
                                <div>
                                    <h4 className="text-white text-xs font-bold">PUBLIC REGISTRATION</h4>
                                    <p className="text-[10px] text-white/30">Allow new users to sign up.</p>
                                </div>
                                <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_5px_currentColor]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border border-white/5">
                                <div>
                                    <h4 className="text-white text-xs font-bold">DEBUG LOGGING</h4>
                                    <p className="text-[10px] text-white/30">Verbose output in server logs.</p>
                                </div>
                                <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default SettingsView;
