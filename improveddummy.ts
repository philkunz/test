import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';

const mispUrl = 'https://your-misp-instance-url';
const mispKey = 'YOUR_MISP_API_KEY';
const mispVerifyCert = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const resolvePtr = promisify(dns.resolvePtr);

const randomIp = () => {
    return `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const malwareNames = ['MalwareA', 'MalwareB', 'MalwareC', 'MalwareD'];
const countryCodes = ['US', 'CA', 'DE', 'FR', 'JP'];

const createDummyEvent = async () => {
    const originIpAddress = randomIp();
    const countryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    let hostname;
    try {
        const hostnames = await resolvePtr(originIpAddress);
        hostname = hostnames[0];
    } catch (error) {
        hostname = 'Unknown';
    }

    const lastOnline = randomDate(new Date(2022, 0, 1), new Date());
    const lastSeen = randomDate(new Date(2022, 0, 1), new Date());
    const malwareName = malwareNames[Math.floor(Math.random() * malwareNames.length)];

    const eventInfo = `Dummy Event - ${Math.floor(Math.random() * 90000) + 10000}`;

    const eventData = {
        info: eventInfo,
        distribution: 0,
        threat_level_id: 2,
        analysis: 1,
        Attribute: [
            {
                type: 'ip-dst',
                value: originIpAddress
            },
            {
                type: 'country',
                value: countryCode
            },
            {
                type: 'hostname',
                value: hostname
            },
            {
                type: 'datetime',
                value: lastOnline,
                comment: 'Last Online'
            },
            {
                type: 'datetime',
                value: lastSeen,
                comment: 'Last Seen'
            },
            {
                type: 'text',
                value: malwareName,
                comment: 'Malware Name'
            }
        ]
    };

    try {
        const response = await axios.post(`${mispUrl}/events/add`, eventData, {
            headers: {
                Authorization: mispKey,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            httpsAgent: mispVerifyCert ? undefined : new (require('https').Agent)({ rejectUnauthorized: false })
        });
        console.log(`Event ${eventInfo} has been created:`, response.data);
    } catch (error) {
        console.error('Error creating event:', error);
    }
};

(async () => {
    while (true) {
        await createDummyEvent();
        await sleep(5000);
    }
})();
