import ipfs from './config/ipfs.js';

async function testConnection() {
  try {
    const id = await ipfs.id();
    console.log('IPFS client connected:', id);
  } catch (error) {
    console.error('Failed to connect to IPFS:', error);
  }
}

testConnection();
