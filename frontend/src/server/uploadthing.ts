import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy'
import { UTApi } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(
    async ({ metadata, file }) => {
      return { fileUrl: file.url }
    }
  ),
} satisfies FileRouter

export const utapi = new UTApi()

export type OurFileRouter = typeof ourFileRouter
