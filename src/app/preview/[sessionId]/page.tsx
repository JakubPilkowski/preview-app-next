import PreviewContent from '../../components/preview-content';

interface PreviewPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we need to provide at least one session ID
  // You can modify this to include actual session IDs if needed
  return [{ sessionId: 'default' }, { sessionId: 'demo' }];
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { sessionId } = await params;
  return <PreviewContent sessionId={sessionId} />;
}
