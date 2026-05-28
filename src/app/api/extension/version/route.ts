import { NextResponse } from 'next/server'

// Bump this whenever you publish a new extension ZIP
const LATEST_VERSION = '2.5.0'
const DOWNLOAD_URL = 'https://production-hub-omega-five.vercel.app/install'

const CORS = {
  'Access-Control-Allow-Origin': 'https://toolkit.artlist.io',
  'Access-Control-Allow-Credentials': 'true',
}

export async function GET() {
  return NextResponse.json(
    { version: LATEST_VERSION, downloadUrl: DOWNLOAD_URL },
    { headers: CORS }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}
