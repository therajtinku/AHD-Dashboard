import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

/**
 * Reusable Chart Component
 * @param {Array} data - Array of objects containing metric data
 * @param {String} dataKey - The key in data objects to plot (e.g., 'sl', 'aht')
 * @param {String} color - Hex color for the chart line/area
 * @param {String} suffix - Unit suffix for the tooltip (e.g., '%', 's')
 * @param {Number} target - Target value to draw a reference line (optional)
 */
export const TrendChart = ({ data, dataKey, color = "#6366f1", suffix = "", target = null }) => {
    if (!data || data.length === 0) {
        return <div className="w-full h-32 flex items-center justify-center text-slate-300 text-xs">No Data</div>;
    }

    // Calculate dynamic domain with some padding for aesthetics
    const values = data.map(d => d[dataKey]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // If target exists, ensure it's in view
    const domainMin = target ? Math.min(min, target) : min;
    const domainMax = target ? Math.max(max, target) : max;

    return (
        <div className="w-full h-32">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        dy={10}
                    />
                    <YAxis
                        domain={[domainMin - (domainMin * 0.05), domainMax + (domainMax * 0.05)]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(val) => `${val.toFixed(0)}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            padding: '8px 12px'
                        }}
                        itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '13px' }}
                        labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}${suffix}`, '']}
                        cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    {target !== null && (
                        <ReferenceLine
                            y={target}
                            stroke="#94a3b8"
                            strokeDasharray="3 3"
                            strokeWidth={1}
                            label={{ position: 'right', value: 'Target', fill: '#94a3b8', fontSize: 10 }}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#color-${dataKey})`}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: color }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
