import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, User, Save } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useClickSound } from '../hooks/useClickSound';
import { v4 as uuidv4 } from 'uuid';

export const AgentFormModal = ({ onClose, editId }) => {
    const { data, addRecord, updateRecord } = useDashboard();
    const { playClickSound } = useClickSound();
    const fileInputRef = useRef(null);

    const initialFormState = {
        agentId: '',
        agentName: '',
        role: 'AHD',
        week: '',
        month: new Date().toISOString().slice(0, 7), // Default to current month YYYY-MM
        numberOfChats: undefined,
        slPercentage: undefined,
        frtSeconds: undefined,
        artSeconds: undefined,
        ahtMinutes: undefined,
        imageUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editId) {
            const record = data.find(d => d.id === editId);
            if (record) {
                setFormData(record);
            }
        }
    }, [editId, data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.agentId || !formData.agentName || !formData.month) {
            alert('Please fill in all required fields');
            return;
        }

        const record = {
            id: editId || uuidv4(),
            agentId: formData.agentId,
            agentName: formData.agentName,
            role: 'AHD',
            week: formData.week,
            month: formData.month,
            numberOfChats: Number(formData.numberOfChats) || 0,
            slPercentage: Number(formData.slPercentage) || 0,
            frtSeconds: Number(formData.frtSeconds) || 0,
            artSeconds: Number(formData.artSeconds) || 0,
            ahtMinutes: Number(formData.ahtMinutes) || 0,
            imageUrl: formData.imageUrl
        };

        if (editId) {
            updateRecord(record);
        } else {
            addRecord(record);
        }
        onClose();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, imageUrl: url });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <h3 className="font-bold text-lg text-slate-800">
                        {editId ? 'Edit Agent Performance' : 'Add New Record'}
                    </h3>
                    <button onClick={() => { playClickSound(); onClose(); }} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex gap-6 flex-col md:flex-row">
                        {/* Image Upload Section */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-200 overflow-hidden flex items-center justify-center relative group shadow-inner">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-slate-300" />
                                )}
                                <div
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
                                >
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer"
                                    onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
                                >
                                    Upload Photo
                                </button>
                                <div className="text-xs text-slate-400 mt-1">or paste URL below</div>
                            </div>
                        </div>

                        {/* Main Fields */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Agent Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field placeholder:text-slate-300"
                                    value={formData.agentName}
                                    onChange={e => setFormData({ ...formData, agentName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Agent ID *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field placeholder:text-slate-300"
                                    value={formData.agentId}
                                    onChange={e => setFormData({ ...formData, agentId: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                                <select
                                    className="input-field bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
                                    value="AHD"
                                    disabled
                                >
                                    <option value="AHD">AHD</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Date (MM-DD-YY) *</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field text-slate-600"
                                    value={formData.month ? `${formData.month}-01` : ''}
                                    onChange={e => {
                                        const date = e.target.value; // YYYY-MM-DD
                                        if (date) {
                                            setFormData({ ...formData, month: date.slice(0, 7) });
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Week *</label>
                                <input
                                    type="week"
                                    required
                                    className="input-field text-slate-600"
                                    value={formData.week}
                                    onChange={e => setFormData({ ...formData, week: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    className="input-field placeholder:text-slate-300"
                                    placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Performance Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Chats</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="input-field font-mono"
                                    value={formData.numberOfChats ?? ''}
                                    onChange={e => setFormData({ ...formData, numberOfChats: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">SL (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="input-field font-mono"
                                    value={formData.slPercentage ?? ''}
                                    onChange={e => setFormData({ ...formData, slPercentage: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">FRT (sec)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    className="input-field font-mono"
                                    value={formData.frtSeconds ?? ''}
                                    onChange={e => setFormData({ ...formData, frtSeconds: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">ART (sec)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    className="input-field font-mono"
                                    value={formData.artSeconds ?? ''}
                                    onChange={e => setFormData({ ...formData, artSeconds: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">AHT (min)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    className="input-field font-mono"
                                    value={formData.ahtMinutes ?? ''}
                                    onChange={e => setFormData({ ...formData, ahtMinutes: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => { playClickSound(); onClose(); }}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={playClickSound}
                            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-200"
                        >
                            <Save className="w-4 h-4" />
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
