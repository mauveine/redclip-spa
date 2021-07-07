/*
 * This is the initial API interface
 * we set the base URL for the API
 */

import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL + '/api',
  withCredentials: true
})
