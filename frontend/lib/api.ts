import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const api = axios.create({ baseURL: API_URL, timeout: 15000, headers: { 'Content-Type': 'application/json' } })

export type UserType = 'Student' | 'Customer' | 'Other'
export type Status = 'New' | 'Contacted' | 'In Progress' | 'Closed'
export type Enquiry = {
  id: string
  name: string
  email: string
  phone: string
  userType: UserType
  serviceOrCourse: string
  message: string
  source: 'Chatbot' | 'Contact Form'
  status: Status
  date: string
}

type ApiEnquiry = Omit<Enquiry, 'id' | 'date'> & { _id: string; createdAt: string }
const normalize = (item: ApiEnquiry): Enquiry => ({ ...item, id: item._id, date: new Date(item.createdAt).toLocaleString() })

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  try {
    const response = await api.request<T>({
      url: path,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(String(options.body)) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : 'Unable to reach DroneTV support.')
      const requestError = new Error(message) as Error & { details?: Array<{ field?: string; message?: string }> }
      requestError.details = error.response?.data?.details
      throw requestError
    }
    throw error
  }
}

export async function login(email: string, password: string) {
  return request<{ data: { token: string; admin: { email: string } } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function getEnquiries(token: string, query = '') {
  const response = await request<{ data: ApiEnquiry[] }>(`/enquiries${query ? `?${query}` : ''}`, {}, token)
  return response.data.map(normalize)
}

export async function updateEnquiry(id: string, status: Status, token: string) {
  const response = await request<{ data: ApiEnquiry }>(`/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, token)
  return normalize(response.data)
}

export async function deleteEnquiry(id: string, token: string) {
  await request(`/enquiries/${id}`, { method: 'DELETE' }, token)
}

export async function createEnquiry(input: Omit<Enquiry, 'id' | 'date' | 'source' | 'status'> & { source: 'Chatbot' | 'Contact Form'; status?: Status }) {
  const response = await request<{ data: ApiEnquiry }>('/enquiries', { method: 'POST', body: JSON.stringify({ ...input, status: input.status || 'New' }) })
  return normalize(response.data)
}

export type ChatMessage = { role: 'user' | 'assistant'; text: string }
export type ChatResponse = { reply: string; provider: 'gemini' | 'fallback'; retryable: boolean; conversationId: string }

export async function sendChat(message: string, history: ChatMessage[] = [], conversationId?: string) {
  return request<{ data: ChatResponse }>('/chat', { method: 'POST', body: JSON.stringify({ message, history, conversationId }) })
}

export type DashboardStats = {
  total: number
  statuses: { new: number; contacted: number; inProgress: number; closed: number }
  bySource: Array<{ _id: string; count: number }>
  activity: Array<{ _id: string; count: number }>
}

export async function getStats(token: string) {
  const response = await request<{ data: DashboardStats }>('/stats', {}, token)
  return response.data
}
