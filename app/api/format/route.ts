import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // Allow up to 60 seconds for large files
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { json, mode, indent = 2 } = body

    // Validate input
    if (!json || typeof json !== 'string') {
      return NextResponse.json(
        { error: 'JSON string is required' },
        { status: 400 }
      )
    }

    // Check size (optional: reject extremely large files)
    const sizeInMB = new Blob([json]).size / (1024 * 1024)
    if (sizeInMB > 10) {
      return NextResponse.json(
        { error: 'JSON file too large. Maximum size is 10MB' },
        { status: 413 }
      )
    }

    // Parse and format JSON
    let parsed: any
    try {
      parsed = JSON.parse(json)
    } catch (err) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON syntax',
          details: err instanceof Error ? err.message : 'Unknown error'
        },
        { status: 400 }
      )
    }

    // Format based on mode
    let formatted: string
    let originalSize = json.length
    let newSize: number

    if (mode === 'minify') {
      formatted = JSON.stringify(parsed)
      newSize = formatted.length
    } else {
      const spaces = typeof indent === 'number' ? indent : parseInt(indent)
      formatted = JSON.stringify(parsed, null, spaces)
      newSize = formatted.length
    }

    // Log for debugging (you'll see this in terminal)
    console.log(`[API] Processed ${originalSize} chars → ${newSize} chars (${mode})`)

    return NextResponse.json({
      success: true,
      data: formatted,
      metadata: {
        originalSize,
        newSize,
        compression: Math.round((1 - newSize / originalSize) * 100),
        mode,
        processedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}