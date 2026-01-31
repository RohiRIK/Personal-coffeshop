'use client';

import { Order, OrderItem } from 'lib/firebase/types';
import { format } from 'date-fns';
import { X, Clock, User, Coffee, Receipt, Star, Info } from 'lucide-react';
import { useCustomerInsights } from 'hooks/use-customer-insights';

interface OrderDetailsModalProps {
    order: Order | null;
    onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    const { insights, loading: insightsLoading } = useCustomerInsights(order?.userId);

    if (!order) return null;

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'preparing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'ready': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'completed': return 'bg-stone-500/10 text-stone-500 border-stone-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-stone-500/10 text-stone-500';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* LEFT: Order Details (Receipt) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start p-6 border-b border-stone-800 bg-stone-900/50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-stone-100">Order #{order.id.slice(-6).toUpperCase()}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-stone-400 text-sm">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {format(order.createdAt, 'MMM d, h:mm a')}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-stone-800 rounded-full text-stone-500 hover:text-stone-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        <div className="bg-stone-950/30 p-4">
                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Receipt className="w-4 h-4" /> Order Summary
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center font-bold text-stone-400 shrink-0">
                                            {item.quantity}x
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-stone-200 text-lg">{item.name}</span>
                                                <span className="text-stone-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="text-sm text-stone-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                {item.milk && <span>Milk: <span className="text-stone-400">{item.milk}</span></span>}
                                                {item.cup && <span>Cup: <span className="text-stone-400">{item.cup}</span></span>}
                                            </div>
                                            {item.specialInstructions && (
                                                <div className="mt-2 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-500 text-sm font-medium">
                                                    Note: "{item.specialInstructions}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-stone-900 border-t border-stone-800 flex justify-end items-center gap-4 mt-auto">
                        <span className="text-stone-400">Total Amount</span>
                        <span className="text-3xl font-bold text-amber-500">${order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* RIGHT: Customer Insights */}
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-stone-800 bg-stone-950 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Profile
                        </h3>
                        <button
                            onClick={onClose}
                            className="hidden md:block p-1 hover:bg-stone-800 rounded-full text-stone-500 hover:text-stone-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-xl font-bold text-stone-400">
                            {order.userName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-stone-200 text-lg">{order.userName}</div>
                            {insights?.isVip && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-stone-900 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-current" /> VIP Member
                                </span>
                            )}
                        </div>
                    </div>

                    {insightsLoading ? (
                        <div className="text-stone-500 text-sm animate-pulse">Loading insights...</div>
                    ) : insights ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                                    <div className="text-xs text-stone-500 mb-1">Total Orders</div>
                                    <div className="text-xl font-bold text-stone-200">{insights.orderCount}</div>
                                </div>
                                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                                    <div className="text-xs text-stone-500 mb-1">Lifetime Value</div>
                                    <div className="text-xl font-bold text-amber-500">${insights.totalSpent.toFixed(0)}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-stone-500 mb-2 font-bold uppercase">Preferences</div>
                                <div className="space-y-3">
                                    {insights.favoriteDrink && (
                                        <div className="flex items-center gap-3 bg-stone-900/50 p-3 rounded-lg">
                                            <Coffee className="w-8 h-8 text-stone-600" />
                                            <div>
                                                <div className="text-xs text-stone-500">Favorite Drink</div>
                                                <div className="font-medium text-stone-300">{insights.favoriteDrink}</div>
                                            </div>
                                        </div>
                                    )}
                                    {insights.favoriteMilk && insights.favoriteMilk !== 'None' && (
                                        <div className="flex items-center gap-3 bg-stone-900/50 p-3 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs">🥛</div>
                                            <div>
                                                <div className="text-xs text-stone-500">Preferred Milk</div>
                                                <div className="font-medium text-stone-300">{insights.favoriteMilk}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-stone-500 italic text-sm">No history found for this user.</div>
                    )}

                    <div className="mt-auto pt-6 border-t border-stone-800">
                        <div className="text-[10px] text-stone-600">
                            User ID: {order.userId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
