import {
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
    return Response.json({ ...result, success: true })
  } catch (error) {
    if (error instanceof MonobankSyncAlreadyRunningError) {
      return Response.json({ success: false, error: error.message }, { status: 409 })
    }

    const message = error instanceof Error ? error.message : 'Monobank sync failed'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}

export async function GET(request: Request): Promise<Response> {
  return handleSync(request)
}

export async function POST(request: Request): Promise<Response> {
  return handleSync(request)
}
