// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 Test API - GET request received')
  
  return NextResponse.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST(request: NextRequest) {
  console.log('🧪 Test API - POST request received')
  
  const body = await request.json()
  console.log('Body:', body)
  
  return NextResponse.json({ 
    success: true, 
    message: 'POST request received',
    received: body,
    timestamp: new Date().toISOString()
  })
}