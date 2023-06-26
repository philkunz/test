import axios from 'axios';

const mispUrl = 'https://your-misp-instance-url';
const mispKey = 'YOUR_MISP_API_KEY';
const mispVerifyCert = false;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createDummyEvent = async () => {
    const eventInfo = `Dummy Event - ${Math.floor(Math.random() * 90000) + 10000}`;

    const eventData = {
        info: eventInfo,
        distribution: 0,
        threat_level_id: 2,
        analysis: 1,
        Attribute: [
            {
                type: 'ip-dst',
                value: '8.8.8.8'
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
