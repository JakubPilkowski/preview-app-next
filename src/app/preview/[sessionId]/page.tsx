import PreviewContent from '../../components/preview-content';

interface PreviewPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { sessionId } = await params;
  return <PreviewContent sessionId={sessionId} />;
}
