/** Vitest alias target for "content-collections": serves the fixtures instead of the build output. */
import { mockContentCollections } from "./content";

const data = mockContentCollections();
export const allProfiles = data.allProfiles;
export const allExperiences = data.allExperiences;
export const allSkills = data.allSkills;
export const allTags = data.allTags;
export const allProjects = data.allProjects;
