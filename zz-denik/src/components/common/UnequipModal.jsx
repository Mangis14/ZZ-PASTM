import React from 'react';
import { Backpack, Trash2, X } from 'lucide-react';

const UnequipModal = ({ itemName, onStash, onDrop, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm rounded-xl border border-fl-primary bg-fl-card/95 backdrop-blur-xl shadow-2xl p-6 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)]">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-bold tracking-wider text-fl-surface textShadow-sm">
                            ODLOŽIŤ VÝZBROJ
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="rounded p-1 text-fl-primary hover:bg-fl-primary/20 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="mb-6 space-y-1 text-center">
                    <p className="text-sm font-bold text-fl-surface-hover">
                        Čo chceš urobiť s: <br/> <span className="text-xl text-fl-primary block mt-2">{itemName}</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onStash}
                        className="w-full flex items-center justify-start gap-4 p-4 rounded-lg bg-fl-paper hover:bg-fl-primary/20 border border-fl-primary/30 hover:border-fl-primary transition-all text-left group"
                    >
                        <div className="text-fl-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all bg-fl-primary/10 p-2 rounded-lg">
                            <Backpack size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-fl-surface tracking-wide uppercase">
                                Do batohu
                            </div>
                            <div className="text-[10px] text-fl-border">
                                Presunie predmet do tvojho inventára
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={onDrop}
                        className="w-full flex items-center justify-start gap-4 p-4 rounded-lg bg-fl-paper hover:bg-red-900/30 border border-red-900/30 hover:border-red-600 transition-all text-left group"
                    >
                        <div className="text-red-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all bg-red-900/10 p-2 rounded-lg">
                            <Trash2 size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-red-500 tracking-wide uppercase">
                                Zahodiť úplne
                            </div>
                            <div className="text-[10px] text-fl-border">
                                Vymaže predmet (bez návratu)
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onCancel}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-transparent hover:bg-white/5 border border-fl-border text-fl-border hover:text-white font-bold uppercase tracking-widest text-xs rounded transition-all"
                    >
                        Zrušiť
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnequipModal;
