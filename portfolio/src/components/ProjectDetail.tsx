import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Download, ArrowLeft, Maximize2, FileText, Eye } from 'lucide-react';
import { useProject, useProjects, useProfile, useSkills } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';
import { CTA } from '@/components/sections/CTA';
import { ProjectCard } from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { project, loading } = useProject(slug || '');
  const { projects } = useProjects();
  const { profile } = useProfile();
  const { skills } = useSkills();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const relatedProjects = projects
    .filter((p) => p.status === 'published' && p.id !== project?.id)
    .slice(0, 3);

  const [mainCarouselRef, mainCarouselApi] = useEmblaCarousel({ loop: true });
  const [modelCarouselRef, modelCarouselApi] = useEmblaCarousel({ loop: true });

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <div className="max-w-[1440px] mx-auto px-4 py-20">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-4">
            Project not found
          </h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-border dark:border-border-dark">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-foreground dark:text-foreground-dark hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <h1 className="text-lg font-semibold text-foreground dark:text-foreground-dark truncate max-w-xs sm:max-w-md">
              {project.title}
            </h1>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => profile?.resume_url && window.open(profile.resume_url, '_blank')}
              >
                <Download className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Resume</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Hero Image Carousel */}
        <section className="py-8">
          <div className="max-w-[1440px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl" ref={mainCarouselRef}>
                <div className="flex">
                  {(project.images?.length > 0 ? project.images : [project.cover_image]).map((image, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0">
                      <div className="relative aspect-[16/9] bg-muted/20">
                        {image ? (
                          <img
                            src={image}
                            alt={`${project.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
                            <span className="text-muted">Project Image {index + 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel navigation */}
              <button
                onClick={() => mainCarouselApi?.scrollPrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => mainCarouselApi?.scrollNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Project Info */}
        <section className="py-8">
          <div className="max-w-[1440px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground-dark">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-xl sm:text-2xl text-muted dark:text-muted-dark font-medium leading-relaxed">
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-muted dark:text-muted-dark">
                {project.tools && project.tools.length > 0 && (
                  <div>
                    <span className="font-medium">Tools:</span> {project.tools.join(', ')}
                  </div>
                )}
                {project.project_type && (
                  <div>
                    <span className="font-medium">Type:</span> {project.project_type}
                  </div>
                )}
                {project.duration && (
                  <div>
                    <span className="font-medium">Duration:</span> {project.duration}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Overview */}
        {project.overview && (
          <section className="py-8">
            <div className="max-w-[1440px] mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-4 inline-block border-b-2 border-primary pb-1">
                  Overview
                </h2>
                <p className="text-foreground/80 dark:text-foreground-dark/80 leading-relaxed whitespace-pre-line">
                  {project.overview}
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* 3D Models */}
        {project.model_images && project.model_images.length > 0 && (
          <section className="py-8">
            <div className="max-w-[1440px] mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-4 inline-block border-b-2 border-primary pb-1">
                  3D Models
                </h2>

                <div className="relative">
                  <div className="overflow-hidden rounded-xl" ref={modelCarouselRef}>
                    <div className="flex">
                      {project.model_images.map((image, index) => (
                        <div key={index} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 p-2">
                          <div
                            className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`3D Model ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => modelCarouselApi?.scrollPrev()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => modelCarouselApi?.scrollNext()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Drawing Details */}
        <section className="py-8">
          <div className="max-w-[1440px] mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-4 inline-block border-b-2 border-primary pb-1">
                  Drawing Details
                </h2>

                {project.drawing_details && (
                  <p className="text-foreground/80 dark:text-foreground-dark/80 leading-relaxed mb-6 whitespace-pre-line">
                    {project.drawing_details}
                  </p>
                )}

                {/* PDF Card Grid as Drawing Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                  {project.pdfs && project.pdfs.length > 0 ? (
                    project.pdfs.map((pdf, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group relative flex flex-col bg-white dark:bg-[#1A1C1E] border-2 border-black dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        {/* Blueprint Preview Area */}
                        <div 
                          className="relative aspect-[4/3] bg-white dark:bg-black/20 flex items-center justify-center cursor-pointer overflow-hidden"
                          onClick={() => window.open(pdf.url, '_blank')}
                        >
                          {/* Background Grid Pattern - Blueprint feel */}
                          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                            style={{ 
                              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                              backgroundSize: '15px 15px'
                            }} 
                          />
                          
                          {/* Real Preview or Placeholder */}
                          {pdf.thumbnail_url ? (
                            <img 
                              src={pdf.thumbnail_url} 
                              alt={pdf.name} 
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                               <FileText className="w-12 md:w-16 h-12 md:h-16 text-primary/30" />
                            </div>
                          )}

                          {/* Eye button overlay */}
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:text-white transition-all">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Info Header Overlay at bottom */}
                        <div 
                          className="p-3 border-t-2 border-black/5 dark:border-white/5 bg-gray-50 dark:bg-black/20 cursor-pointer"
                          onClick={() => window.open(pdf.url, '_blank')}
                        >
                          <p className="font-black text-sm md:text-base text-foreground dark:text-foreground-dark uppercase tracking-tight truncate leading-tight">
                            {pdf.name || `Drawing ${index + 1}`}
                          </p>
                          {pdf.size && (
                            <p className="text-[10px] md:text-xs font-mono text-muted dark:text-muted-dark opacity-70 mt-0.5">
                              {(pdf.size / (1024 * 1024)).toFixed(2)} MB • PDF
                            </p>
                          )}
                        </div>

                        {/* Hover Overlay Text */}
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                      <p className="text-muted text-sm italic">No PDF drawings uploaded for this project.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
        </section>



        {/* Related Projects */}
        <section className="py-12 bg-muted/5 dark:bg-muted/5">
          <div className="max-w-[1440px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-12 inline-block border-b-2 border-primary pb-1">
                Related Projects
              </h2>
              
              <div className="space-y-12">
                {relatedProjects.length > 0 ? (
                  relatedProjects.map((p) => (
                    <ProjectCard 
                      key={p.id} 
                      project={p} 
                      skills={skills}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-muted">
                    No other projects found
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <CTA profile={profile} />
      </main>

      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-lg"
            >
              Close
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto rounded-lg"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
