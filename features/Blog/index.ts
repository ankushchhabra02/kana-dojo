/**
 * Blog Feature Module
 * Public API for the blog system
 */

// Types
export type {
  BlogPost,
  BlogPostMeta,
  Category,
  Difficulty,
  Heading,
  Locale
} from './types/blog';

export {
  REQUIRED_FRONTMATTER_FIELDS,
  VALID_CATEGORIES,
  VALID_DIFFICULTIES,
  VALID_LOCALES
} from './types/blog';

// Lib functions
export { calculateReadingTime } from './lib/calculateReadingTime';
export {
  validateFrontmatter,
  type ValidationResult
} from './lib/validateFrontmatter';
