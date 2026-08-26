import axios from 'axios'

//axios instance ... 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

// Listings
export const fetchListings = (page = 1) => api.get(`/listings?page=${page}`)
export const fetchListingsByCategory = (category, page = 1) => api.get(`/listings/category/${category}?page=${page}`)
export const searchListings = (term, page = 1) => api.get(`/listings/search?searchTerm=${term}&page=${page}`)
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
export const toggleWatchlist = (listingId) => api.post(`/users/watchlist/${listingId}`)
export const fetchWatchlist = () => api.get('/users/watchlist')

// AI
export const generateDescription = (data) => api.post('/generate-description', data)

// Bookings
export const createBooking = (data) => api.post('/bookings', data)
export const fetchMyBookings = () => api.get('/bookings/me')

export default api
