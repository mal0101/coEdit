import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Comment service object containing all comment-related API calls
 */
const commentService = {
  /**
   * Gets all comments for a document
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Array>} Array of comment objects
   */
  async getDocumentComments(documentId) {
    const response = await api.get(
      API_ENDPOINTS.COMMENTS.BY_DOCUMENT(documentId)
    );
    return response.data;
  },

  /**
   * Creates a new comment on a document
   * @param {string|number} documentId - Document ID
   * @param {string} body - Comment text
   * @param {number|null} location - Optional position in document
   * @returns {Promise<Object>} Created comment object
   */
  async createComment(documentId, body, location = null) {
    const payload = {
      document: { id: documentId },
      body,
    };

    if (location !== null) {
      payload.location = location;
    }

    const response = await api.post(API_ENDPOINTS.COMMENTS.BASE, payload);
    return response.data;
  },

  /**
   * Updates an existing comment
   * @param {string|number} commentId - Comment ID
   * @param {string} body - Updated comment text
   * @returns {Promise<Object>} Updated comment object
   */
  async updateComment(commentId, body) {
    const response = await api.put(API_ENDPOINTS.COMMENTS.BY_ID(commentId), {
      body,
    });
    return response.data;
  },

  /**
   * Deletes a comment
   * @param {string|number} commentId - Comment ID
   * @returns {Promise<void>}
   */
  async deleteComment(commentId) {
    await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
  },

  /**
   * Gets a single comment by ID
   * @param {string|number} commentId - Comment ID
   * @returns {Promise<Object>} Comment object
   */
  async getComment(commentId) {
    const response = await api.get(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
    return response.data;
  },
};

export default commentService;
