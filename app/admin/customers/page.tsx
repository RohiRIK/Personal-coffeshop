'use client';

import { useState, useEffect } from 'react';
import { getOrders } from 'lib/firebase/orders';
import { Order } from 'lib/firebase/types';
import { formatDistanceToNow, format } from 'date-fns';

interface CustomerMetric {
    userId: string;
    name: string;
    email?: string; // Not in Order type currently, using name
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
    firstOrderDate: Date;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerMetric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const allOrders = await getOrders();

            const customerMap = new Map<string, CustomerMetric>();

            allOrders.forEach(order => {
                const existing = customerMap.get(order.userId);

                if (existing) {
                    existing.totalSpent += order.total;
                    existing.orderCount += 1;
                    if (order.createdAt > existing.lastOrderDate) {
                        existing.lastOrderDate = order.createdAt;
                    }
                    if (order.createdAt < existing.firstOrderDate) {
                        existing.firstOrderDate = order.createdAt;
                    }
                } else {
                    customerMap.set(order.userId, {
                        userId: order.userId,
                        name: order.userName || 'Unknown Guest',
                        totalSpent: order.total,
                        orderCount: 1,
                        lastOrderDate: order.createdAt,
                        firstOrderDate: order.createdAt,
                    });
                }
            });

            const sortedCustomers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
            setCustomers(sortedCustomers);
            setLoading(false);
        }

        loadData();
    }, []);

    if (loading) return <div className="text-stone-400">Loading analytics...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-stone-100 mb-2">Customer Insights</h1>
            <p className="text-stone-400 mb-8">Top performing customers and lifetime value.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Customers" value={customers.length.toString()} />
                <StatCard label="Total Revenue" value={`$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`} />
                <StatCard label="Avg. Order Value" value={`$${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orderCount, 0) || 0).toFixed(2)}`} />
            </div>

            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-800 text-stone-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Total Orders</th>
                            <th className="px-6 py-4 font-medium">Lifetime Value</th>
                            <th className="px-6 py-4 font-medium">Last Seen</th>
                            <th className="px-6 py-4 font-medium">Member Since</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                        {customers.map((customer) => (
                            <tr key={customer.userId} className="hover:bg-stone-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-stone-200">{customer.name}</div>
                                    <div className="text-xs text-stone-500 font-mono">{customer.userId.slice(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4 text-stone-300">
                                    {customer.orderCount}
                                </td>
                                <td className="px-6 py-4 text-amber-400 font-bold">
                                    ${customer.totalSpent.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-stone-400 text-sm">
                                    {formatDistanceToNow(customer.lastOrderDate, { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4 text-stone-500 text-sm">
                                    {format(customer.firstOrderDate, 'MMM d, yyyy')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
            <h3 className="text-stone-500 text-sm font-medium mb-1 uppercase tracking-wider">{label}</h3>
            <p className="text-3xl font-bold text-stone-100">{value}</p>
        </div>
    )
}
