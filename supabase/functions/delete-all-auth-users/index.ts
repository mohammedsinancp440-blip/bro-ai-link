import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0'

Deno.serve(async (req) => {
  try {
    // Simple verification (for internal use only)
    const url = new URL(req.url)
    const confirmDelete = url.searchParams.get('confirm')
    
    if (confirmDelete !== 'DELETE_ALL_USERS') {
      return new Response(
        JSON.stringify({ error: 'Missing confirmation parameter' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all users
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    // Delete each user
    const deletePromises = users.map(user => 
      supabaseAdmin.auth.admin.deleteUser(user.id)
    )
    
    await Promise.all(deletePromises)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Deleted ${users.length} users`,
        count: users.length 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
