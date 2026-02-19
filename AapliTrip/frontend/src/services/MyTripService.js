import axios from "axios";
import {
  BOOK_MY_TRIP_API_URL,
  GET_MY_TRIP_API_URL,
  GET_USER_NAME_AND_ID,
  GET_ALL_BOOKINGS_API_URL,
  CONFIRM_PAYMENT_API_URL,
  API_BASE_URL
} from "../Constants/APIConstants";
import { getToken } from "./TokenService";

export function getAuthHeader() {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function bookMyTrip(id, tripData) {
  return axios.post(`${BOOK_MY_TRIP_API_URL}/${id}`, tripData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getMyTrips(id) {
  return axios.get(`${GET_MY_TRIP_API_URL}/${id}`);
}

export function getUserId() {
  return axios.get(`${GET_USER_NAME_AND_ID}`, getAuthHeader());
}

export function getAllBookings() {
  return axios.get(GET_ALL_BOOKINGS_API_URL);
}

export function updateBookingStatus(bookingId, status) {
  return axios.put(`${GET_ALL_BOOKINGS_API_URL}/${bookingId}/${status}`);
}

export function confirmPayment(bookingId, transactionId) {
  return axios.put(`${CONFIRM_PAYMENT_API_URL}/${bookingId}/pay`, { transactionId });
}

export function createOrder(amount) {
  return axios.post(`${API_BASE_URL}/api/payment/createOrder`, { amount }, getAuthHeader());
}