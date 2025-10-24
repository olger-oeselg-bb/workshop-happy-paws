/**
 * API Service Layer
 * Centralized exports for all API services
 */

// HTTP utilities
export { apiGet, apiPost, apiPatch, apiDelete, ApiError } from './http.js';

// API services
export { petsApi } from './pets.js';
export { medicalRecordsApi } from './medicalRecords.js';