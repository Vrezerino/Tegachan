import { Client } from 'pg';
import { PGDB_URL } from './env';

let client: Client;

export const getClient = async () => {
  if (!client) {
    client = new Client({
      connectionString: PGDB_URL
    });
    await client.connect();
  }
  return client;
};

