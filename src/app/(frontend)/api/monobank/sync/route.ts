import {
  MonobankSyncCooldownError,
  MonobankSyncAlreadyRunningError,
  syncMonobankJarSnapshots,
} from '@/utilities/syncMonobankJarSnapshots'

export const maxDuration = 600

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  return request.headers.get('authorization') === `Bearer ${secret}`
}

async function handleSync(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await syncMonobankJarSnapshots()
    return Response.json({ ok: true, result })
  } catch (error) {
    if (error instanceof MonobankSyncAlreadyRunningError) {
      return Response.json({ ok: false, error: error.message }, { status: 409 })
    }

    if (error instanceof MonobankSyncCooldownError) {
      return Response.json(
        { ok: false, error: error.message, retryAfterMs: error.retryAfterMs },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(error.retryAfterMs / 1000)),
          },
        },
      )
    }

    const message = error instanceof Error ? error.message : 'Monobank sync failed'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET(request: Request): Promise<Response> {
  return handleSync(request)
}

export async function POST(request: Request): Promise<Response> {
  return handleSync(request)
}
