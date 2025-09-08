'use client'

import axios from 'axios'

export async function saveTours(tour: any) {
  const token = localStorage.getItem('token')
  const response = await axios.post('/api/tours', tour, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function getMyTours() {
  const token = localStorage.getItem('token')
  const response = await axios.get('/api/mes-tours', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function getAllTours(ville: string) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const response = await axios.get(`/api/tours/ville/${ville}`, { headers })
  return response.data
}

export async function getTourById(id: string) {
  console.log(id)
  const token = localStorage.getItem('token')
  const response = await axios.get(`/api/tours/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function createTourReservation(tourId: string, reservation: any) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/tours/${tourId}/reservations`, reservation, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function createTourCheckoutSession(tourId: string, reservation: any) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/reservations/create-payment-session`, reservation, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function getMyReservations() {
  const token = localStorage.getItem('token')
  const response = await axios.get('/api/mes-reservations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function createReservationCheckoutSession(data: {
  _id: string,
  tour_info?: any,
  jour_info?: any
}) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/reservations/complete-reservation`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function cancelReservation(data: {
  reservationId: string,
  tourId: string,
  jourId: string
}) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/reservations/annuler-reservation-touriste`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export async function confirmPayment(data: {
  reservation_id: string
  tour_id: string
  jour_id: string
  client_id: string
  payment_id?: string
}) {
  const token = localStorage.getItem('token')
  const response = await axios.post('/api/reservations/confirm-payment', data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}
