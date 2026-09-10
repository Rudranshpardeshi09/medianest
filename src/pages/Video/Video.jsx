import { PageHeader } from '@/components/layout/PageHeader'
import { VideoShowcase } from '@/components/sections/VideoShowcase'

export function VideoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Video"
        title="Moving image."
        description="A dedicated video and media showcase. Player behavior will be implemented after the foundation is in place."
      />
      <VideoShowcase />
    </>
  )
}
