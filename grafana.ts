import axios from 'axios';
import fs from 'fs';
import https from 'https';

interface IDashboardSummary {
    uid: string;
    title: string;
}

interface IDataSource {
    id: number;
    name: string;
    type: string;
    url: string;
    access: string;
    isDefault: boolean;
}

const GRAFANA_API_URL = 'https://your-grafana-url/api';
const GRAFANA_API_KEY = 'your-api-key';

// Axios instance with SSL certificate error ignored
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false  // This disables SSL certificate validation
    }),
    headers: {
        Authorization: `Bearer ${GRAFANA_API_KEY}`
    }
});

async function fetchDashboardDetails(uid: string): Promise<any> {
    try {
        const response = await axiosInstance.get(`${GRAFANA_API_URL}/dashboards/uid/${uid}`);
        return response.data.dashboard; // Returns the full dashboard configuration
    } catch (error) {
        console.error('Error fetching dashboard details:', error);
        return null;
    }
}

async function fetchDashboards(): Promise<void> {
    try {
        const searchResponse = await axiosInstance.get(`${GRAFANA_API_URL}/search?query=&type=dash-db`);
        const dashboardPromises = searchResponse.data.map((dashboard: IDashboardSummary) => fetchDashboardDetails(dashboard.uid));
        const dashboards = await Promise.all(dashboardPromises);
        fs.writeFileSync('dashboards.json', JSON.stringify(dashboards, null, 2));
        console.log('Dashboards saved to dashboards.json');
    } catch (error) {
        console.error('Error fetching dashboards:', error);
    }
}

async function fetchDataSources(): Promise<void> {
    try {
        const response = await axiosInstance.get(`${GRAFANA_API_URL}/datasources`);
        fs.writeFileSync('datasources.json', JSON.stringify(response.data, null, 2));
        console.log('Data sources saved to datasources.json');
    } catch (error) {
        console.error('Error fetching data sources:', error);
    }
}

async function main() {
    await fetchDashboards();
    await fetchDataSources();
}

main();
