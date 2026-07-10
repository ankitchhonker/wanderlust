import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Listings
export const fetchListings = () => api.get('/listings')
export const fetchListingsByCategory = (category) => api.get(`/listings/category/${category}`)
export const searchListings = (term) => api.get(`/listings/search?searchTerm=${term}`)
export const fetchListing = (id) => api.get(`/listings/${id}`)
export const createListing = (formData) => api.post('/listings', formData)
export const updateListing = (id, formData) => api.put(`/listings/${id}`, formData)
export const deleteListing = (id) => api.delete(`/listings/${id}`)

// Reviews
export const createReview = (listingId, data) => api.post(`/listings/${listingId}/reviews`, data)
export const deleteReview = (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`)

// Auth
export const signUp = (data) => api.post('/users/signup', data)
export const login = (data) => api.post('/users/login', data)
export const logout = () => api.post('/users/logout')
export const getMe = () => api.get('/users/me')

// AI
export const generateDescription = (data) => api.post('/generate-description', data)

export default api
