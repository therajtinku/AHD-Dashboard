/**
 * Generates mock historical data for an agent to display in charts.
 * It uses the agent's current stats as a baseline and creates realistic variations
 * for the previous 4 weeks.
 * 
 * @param {Object} agent - The agent object
 * @returns {Array} Array of data points for the last 4 weeks
 */
export const generateMockHistory = (agent) => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Current'];

    // Helper to add random variance to a value
    const variance = (val, percent = 0.1) => {
        const numericVal = Number(val);
        if (isNaN(numericVal)) return 0;
        const offset = numericVal * percent * (Math.random() - 0.5) * 2;
        return Number((numericVal - offset).toFixed(1));
    };

    return weeks.map((week, index) => {
        const isCurrent = index === 3;

        // For the current week, use the actual agent data
        if (isCurrent) {
            return {
                name: week,
                sl: Number(agent.slPercentage.toFixed(1)),
                frt: Number(agent.frtSeconds.toFixed(1)),
                art: Number(agent.artSeconds.toFixed(1)),
                aht: Number(agent.ahtMinutes.toFixed(1)),
                chats: agent.numberOfChats
            };
        }

        // For past weeks, generate variance from the current stats
        // This makes the trend look realistic (not completely random)
        return {
            name: week,
            // SL should stay within 0-100 logic
            sl: Math.min(100, Math.max(0, variance(agent.slPercentage, 0.15))),
            // Time metrics variance
            frt: Math.max(10, variance(agent.frtSeconds, 0.2)),
            art: Math.max(10, variance(agent.artSeconds, 0.2)),
            aht: Math.max(2, variance(agent.ahtMinutes, 0.15)),
            // Chat volume slightly variable
            chats: Math.max(0, Math.round(variance(agent.numberOfChats, 0.25)))
        };
    });
};
