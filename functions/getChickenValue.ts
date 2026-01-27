import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientSeed, serverSeed, difficulty } = await req.json();

    if (!difficulty) {
      return Response.json({ error: 'Difficulty is required' }, { status: 400 });
    }

    const response = await fetch('https://aquila.cash/api/v1/prediction/chicken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSeed: clientSeed || null,
        serverSeed: serverSeed || null,
        difficulty: difficulty
      })
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to get value from API' }, { status: response.status });
    }

    const data = await response.json();

    return Response.json({
      game: data.game,
      result: data.result,
      twist: data.twist
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});