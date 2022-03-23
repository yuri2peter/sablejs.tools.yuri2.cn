export async function middleware() {
  if (process.env.ENABLE_NAPLES_ADMIN !== 'YES') {
    return new Response(null, { status: 423 });
  }
}
