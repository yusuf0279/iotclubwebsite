"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// --- Types ---
interface ImageData {
  id: string
  src: string
  alt?: string
}

interface GalleryContextType {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
}

const GalleryContext = React.createContext<GalleryContextType | null>(null)

// --- Physics ---
const spring = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
  mass: 1,
}

// --- Components ---

/**
 * Root Gallery Provider
 * Manages the state of the expanded image and renders the Modal.
 */
export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  },[])

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  return (
    <MotionConfig reducedMotion="user">
      <GalleryContext.Provider value={{ selectedImage, setSelectedImage }}>
        {children}
        <GalleryModal />
      </GalleryContext.Provider>
    </MotionConfig>
  )
}

/**
 * Responsive Masonry Grid
 */
export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Individual Gallery Image Thumbnail
 */
export function GalleryImage({
  src,
  alt,
  id,
  className,
}: {
  src: string
  alt?: string
  id: string
  className?: string
}) {
  const context = React.useContext(GalleryContext)
  if (!context) throw new Error("GalleryImage must be used within a Gallery")

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative mb-4 break-inside-avoid cursor-zoom-in overflow-hidden",
        className
      )}
      onClick={() => context.setSelectedImage({ id, src, alt })}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || "Gallery Image"}
        className="w-full h-auto object-cover"
        variants={{
          hover: { scale: 0.98 },
          tap: { scale: 0.95 },
        }}
        transition={spring}
      />

      {/* Subtle hover overlay for premium feel */}
      <motion.div
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        className="absolute inset-0 bg-bg/10 pointer-events-none"
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}

/**
 * Expanded View Modal with Drag-to-Dismiss
 */
function GalleryModal() {
  const context = React.useContext(GalleryContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!context || !mounted) return null

  const { selectedImage, setSelectedImage } = context

  // Portal to <body> so the overlay sits above the site navbar,
  // which would otherwise be stacked over it by a parent z-index.
  return createPortal(
    <AnimatePresence>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Frosted glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bg/95"
            onClick={() => setSelectedImage(null)}
          />

          {/* Interactive container for drag gesture */}
          <motion.div
            className="relative z-10 w-full h-full flex items-center justify-center cursor-zoom-out"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => {
              // Dismiss if dragged far enough or fast enough
              if (
                Math.abs(info.offset.y) > 100 ||
                Math.abs(info.velocity.y) > 300
              ) {
                setSelectedImage(null)
              }
            }}
            onClick={() => setSelectedImage(null)}
          >
            {/* The Shared Element */}
            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.src}
              alt={selectedImage.alt || "Selected gallery image"}
              className="w-auto h-auto max-w-[95vw] max-h-[90vh] rounded-sm object-contain will-change-transform"
              draggable={false} // Prevent native drag to allow framer-motion drag
              transition={spring}
            />
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute top-6 right-6 z-50 p-2.5 bg-surface text-text border border-control hover:border-accent hover:text-accent transition-colors duration-150"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
