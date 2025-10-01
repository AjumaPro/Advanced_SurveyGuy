/**
 * Question Renderers Index
 * Exports all question type renderer components
 */

export { default as RankingQuestion } from './RankingQuestion';
export { default as MatrixQuestion } from './MatrixQuestion';
export { default as YesNoQuestion } from './YesNoQuestion';
export { default as ScaleQuestion } from './ScaleQuestion';
export { default as SliderQuestion } from './SliderQuestion';
export { default as FileUploadQuestion } from './FileUploadQuestion';

// Component registry for dynamic loading
export const questionRenderers = {
  ranking: () => import('./RankingQuestion'),
  matrix: () => import('./MatrixQuestion'),
  yes_no: () => import('./YesNoQuestion'),
  scale: () => import('./ScaleQuestion'),
  slider: () => import('./SliderQuestion'),
  file: () => import('./FileUploadQuestion')
};

// Get renderer component for a question type
export const getQuestionRenderer = async (type) => {
  const loader = questionRenderers[type];
  if (!loader) return null;
  
  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load renderer for type: ${type}`, error);
    return null;
  }
};

