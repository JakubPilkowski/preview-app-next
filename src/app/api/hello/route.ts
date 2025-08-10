export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: Request) {
  return new Response('Hello, from API!');
}
