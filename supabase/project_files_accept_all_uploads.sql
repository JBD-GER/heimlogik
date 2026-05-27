-- Allow project uploads to keep original files when browser/device conversion is not available.
-- Run once in Supabase SQL editor on existing installations.

update storage.buckets
set allowed_mime_types = null
where id = 'project-files';
