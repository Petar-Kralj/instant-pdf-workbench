import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { editMetadata, downloadPdf } from '@/lib/pdf-utils';

export default function MetadataTool() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (files: File[]) => {
    setFile(files[0] || null);
    setDone(false);
    setError('');
  };

  const handleApply = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const result = await editMetadata(file, {
        title: title || undefined,
        author: author || undefined,
        subject: subject || undefined,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
      });
      downloadPdf(result, `metadata_${file.name}`);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout title="Edit Metadata" description="Edit PDF title, author, subject, and keywords.">
      <FileDropzone accept=".pdf" onFiles={handleFile} />

      {file && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{file.name}</p>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1" placeholder="Document title" />
          </div>
          <div>
            <label className="text-sm font-medium">Author</label>
            <Input value={author} onChange={e => setAuthor(e.target.value)} className="mt-1" placeholder="Author name" />
          </div>
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} className="mt-1" placeholder="Subject" />
          </div>
          <div>
            <label className="text-sm font-medium">Keywords (comma-separated)</label>
            <Input value={keywords} onChange={e => setKeywords(e.target.value)} className="mt-1" placeholder="pdf, tools, merge" />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Updated PDF downloaded!</span>
        </div>
      )}

      <Button
        onClick={handleApply}
        disabled={!file || processing}
        className="w-full rounded-full gradient-bg border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        size="lg"
      >
        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Metadata & Download'}
      </Button>
    </ToolPageLayout>
  );
}
