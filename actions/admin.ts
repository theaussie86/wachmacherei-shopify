'use server';

export async function triggerProductCreation(r2o_itemnumber: string) {
  const res = await fetch(`${process.env.N8N_WEBHOOK_BASE}/cb33b59d-3a5c-47b1-b2b3-b2fdc3adf99f`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-WACHMACHEREI': process.env.N8N_WEBHOOK_SECRET || ''
    },
    body: JSON.stringify({ r2o_itemnumber })
  });
  return res.json();
}
