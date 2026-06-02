import { slidesExtra } from './slides_extra';
import { slidesBase } from './slides_base';

export const slides = [...slidesBase, ...slidesExtra].sort((a, b) => a.order - b.order);

export const getSlideById = (id: string) => slides.find((s) => s.id === id);
export const getSlidesByDomain = (domain: string) => slides.filter((s) => s.domain === domain);
export const getAllSections = () => slides.flatMap((s) => s.sections.map((sec) => ({ ...sec, slideId: s.id, slideTitle: s.title, domain: s.domain })));
export const getSlideByQuestionId = (questionId: string) =>
  slides.find((s) => s.quizQuestionIds.includes(questionId));
