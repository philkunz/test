type TObject = Record<string, unknown>;

async function hashObject(obj: TObject): Promise<string> {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // Encode the JSON string to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);

  // Use the SubtleCrypto interface to hash the data
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

// Example usage
const myObject = { name: 'Deno', type: 'runtime' };
hashObject(myObject).then(console.log);
