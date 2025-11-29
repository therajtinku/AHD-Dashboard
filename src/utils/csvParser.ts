import Papa from 'papaparse';
import type { AgentPerformance, Role } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseCSV = (file: File): Promise<AgentPerformance[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsedData: AgentPerformance[] = results.data.map((row: any) => {
                        // Basic validation could go here
                        if (!row.agentId || !row.agentName) {
                            throw new Error("Missing required fields");
                        }

                        return {
                            id: uuidv4(), // Generate a local ID for React keys
                            agentId: row.agentId,
                            agentName: row.agentName,
                            role: (row.role as Role) || 'Tier 1',
                            week: row.week,
                            month: row.month,
                            numberOfChats: parseInt(row.numberOfChats, 10) || 0,
                            slPercentage: parseFloat(row.slPercentage || row.sl) || 0,
                            frtSeconds: parseFloat(row.frtSeconds || row.frt) || 0,
                            artSeconds: parseFloat(row.artSeconds) || 0,
                            ahtMinutes: parseFloat(row.ahtMinutes || row.ahtSeconds) || 0,
                            imageUrl: row.imageUrl
                        };
                    });
                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

export const parseCSVFromUrl = async (url: string): Promise<AgentPerformance[]> => {
    // Handle Google Sheets URLs
    let fetchUrl = url;
    if (url.includes('docs.google.com/spreadsheets')) {
        // Convert /edit... to /export?format=csv
        fetchUrl = url.replace(/\/edit.*$/, '/export?format=csv');
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const text = await response.text();

    // Use the same parsing logic, just with a string input
    return new Promise((resolve, reject) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    if (results.errors && results.errors.length > 0) {
                        // Filter out non-critical errors if needed, but for now report them
                        console.warn('CSV Parsing errors:', results.errors);
                    }

                    const parsedData: AgentPerformance[] = results.data
                        .filter((row: any) => {
                            // Basic validation: must have agentId or agentName to be valid
                            return row.agentId && row.agentName;
                        })
                        .map((row: any) => ({
                            id: uuidv4(),
                            agentId: row.agentId,
                            agentName: row.agentName,
                            role: (row.role as Role) || 'Tier 1',
                            week: row.week,
                            month: row.month,
                            numberOfChats: parseInt(row.numberOfChats, 10) || 0,
                            slPercentage: parseFloat(row.slPercentage || row.sl) || 0,
                            frtSeconds: parseFloat(row.frtSeconds || row.frt) || 0,
                            artSeconds: parseFloat(row.artSeconds) || 0,
                            ahtMinutes: parseFloat(row.ahtMinutes || row.ahtSeconds) || 0,
                            imageUrl: row.imageUrl
                        }));

                    if (parsedData.length === 0) {
                        throw new Error('No valid data found in CSV. Please check the format.');
                    }

                    resolve(parsedData);
                } catch (e) {
                    reject(e);
                }
            },
            error: (e: any) => reject(e)
        });
    });
};
