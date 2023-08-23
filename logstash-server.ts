import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as pem from 'pem';

const keyPath = 'path/to/key.pem';
const certPath = 'path/to/cert.pem';

// Function to create self-signed certificates
const createCertificate = (callback: (sslOptions: { key: string, cert: string }) => void) => {
  pem.createCertificate({ days: 3650, selfSigned: true }, (err, keys) => {
    if (err) {
      throw err;
    }

    fs.writeFileSync(keyPath, keys.serviceKey);
    fs.writeFileSync(certPath, keys.certificate);

    callback({ key: keys.serviceKey, cert: keys.certificate });
  });
};

// Handler function for both HTTP and HTTPS
const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log('Incoming Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!\n');
};

// Create HTTP server
const httpServer = http.createServer(requestHandler);
httpServer.listen(5011, () => {
  console.log('HTTP server running on http://localhost:5011');
});

// Check if certificate files exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('Certificate files not found. Creating self-signed certificate...');
  createCertificate((sslOptions) => {
    // Create HTTPS server
    const httpsServer = https.createServer(sslOptions, requestHandler);
    httpsServer.listen(5012, () => {
      console.log('HTTPS server running on https://localhost:5012');
    });
  });
} else {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  // Create HTTPS server
  const httpsServer = https.createServer(sslOptions, requestHandler);
  httpsServer.listen(5012, () => {
    console.log('HTTPS server running on https://localhost:5012');
  });
}
