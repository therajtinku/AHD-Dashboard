import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

// Helper function to parse percentage values
const parsePercentage = (value) => {
    if (!value) return 0;
    // Remove % sign if present and parse as float
    const cleaned = String(value).replace('%', '').trim();
    return parseFloat(cleaned) || 0;
};

export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsedData = results.data.map((row) => {
                        // Basic validation could go here
                        if (!row.agentId || !row.agentName) {
                            throw new Error("Missing required fields");
                        }

                        return {
                            // Generate stable ID from agentId + period (week or month)
                            // This ensures the same agent's data for the same period always has the same ID
                            // Prevents duplicates during sync by allowing proper upsert matching
                            id: `${row.agentId}-${row.week || row.month}`,
                            agentId: row.agentId,
                            agentName: row.agentName,
                            role: row.role || 'Tier 1',
                            week: row.week,
                            month: row.month,
                            numberOfChats: parseInt(row.numberOfChats, 10) || 0,
                            slPercentage: parsePercentage(row.slPercentage || row.sl),
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

export const parseCSVFromUrl = async (url) => {
    // Handle Google Sheets URLs
    let fetchUrl = url.trim();
    if (fetchUrl.includes('docs.google.com/spreadsheets')) {
        // Extract spreadsheet ID and gid (sheet ID)
        const spreadsheetIdMatch = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);

        if (!spreadsheetIdMatch) {
            throw new Error('Invalid Google Sheets URL');
        }

        const spreadsheetId = spreadsheetIdMatch[1];
        const gid = gidMatch ? gidMatch[1] : '0';

        // Use CORS proxy to bypass CORS restrictions
        // Alternative: Use Google Sheets API with proper authentication
        const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

        // Use a CORS proxy for client-side fetching
        // Popular options: cors-anywhere, allorigins, corsproxy
        fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;
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

                    const parsedData = results.data
                        .filter((row) => {
                            // Basic validation: must have agentId or agentName to be valid
                            return row.agentId && row.agentName;
                        })
                        .map((row) => ({
                            // Generate stable ID from agentId + period (week or month)
                            // This ensures the same agent's data for the same period always has the same ID
                            id: `${row.agentId}-${row.week || row.month}`,
                            agentId: row.agentId,
                            agentName: row.agentName,
                            role: row.role || 'Tier 1',
                            week: row.week,
                            month: row.month,
                            numberOfChats: parseInt(row.numberOfChats, 10) || 0,
                            slPercentage: parsePercentage(row.slPercentage || row.sl),
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
            error: (e) => reject(e)
        });
    });
};

