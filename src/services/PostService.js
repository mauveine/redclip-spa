import * as API from '@/services/API'

export default {
  createPost (data) {
    return API.apiClient.post('/posts', data)
  },
  vote (postId) {
    return API.apiClient.post(`/posts/${postId}/vote`)
  },
  updatePost (postId, data) {
    return API.apiClient.patch(`/posts/${postId}`, data)
  },
  getPost (postId) {
    return API.apiClient.get(`/posts/${postId}`)
  },
  getPosts (params) {
    return API.apiClient.get('/posts', { params: params })
  },
  deletePost (postId) {
    return API.apiClient.delete(`/posts/${postId}`)
  },
  createComment (data, postId, commentId = null) {
    let url = ''
    if (commentId) {
      url = `/posts/${postId}/comments/${commentId}`
    } else {
      url = `/posts/${postId}/comments`
    }
    return API.apiClient.post(url, data)
  },
  deleteComment (postId, commentId) {
    return API.apiClient.delete(`/posts/${postId}/comments/${commentId}`)
  },
  voteComment (postId, commentId) {
    return API.apiClient.post(`/posts/${postId}/comments/${commentId}/vote`)
  }
}
