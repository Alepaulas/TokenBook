import ipfs from './config/ipfs.js';

async function testConnection() {
    try {
        const id = await ipfs.id();
        console.log('IPFS conectado com sucesso:', {
            ...id,
            addresses: id.addresses.filter(addr => !addr.includes('webrtc-direct'))
        });
    } catch (error) {
        console.error('Erro ao conectar ao IPFS:', error);
    }
}

testConnection();
