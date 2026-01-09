import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Document service object containing all document-related API calls
 */
const documentService = {
  /**
   * Retrieves all accessible documents for the current user
   * @returns {Promise<Array>} Array of document objects
   */
  async getAllDocuments() {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS.BASE);
    return response.data;
  },

  /**
   * Retrieves a single document by ID
   * @param {string|number} id - Document ID
   * @returns {Promise<Object>} Document object
   */
  async getDocument(id) {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    return response.data;
  },

  /**
   * Retrieves all documents owned by a specific user
   * @param {string|number} ownerId - Owner's user ID
   * @returns {Promise<Array>} Array of document objects
   */
  async getDocumentsByOwner(ownerId) {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS.BY_OWNER(ownerId));
    return response.data;
  },

  /**
   * Creates a new document
   * @param {string} title - Document title
   * @param {string} content - Document content
   * @returns {Promise<Object>} Created document object
   */
  async createDocument(title, content = "") {
    const response = await api.post(API_ENDPOINTS.DOCUMENTS.BASE, {
      title,
      content,
    });
    return response.data;
  },

  /**
   * Updates an existing document
   * @param {string|number} id - Document ID
   * @param {Object} updates - Object containing title and/or content
   * @returns {Promise<Object>} Updated document object
   */
  async updateDocument(id, updates) {
    const response = await api.put(API_ENDPOINTS.DOCUMENTS.BY_ID(id), updates);
    return response.data;
  },

  /**
   * Deletes a document
   * @param {string|number} id - Document ID
   * @returns {Promise<void>}
   */
  async deleteDocument(id) {
    await api.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
  },

  /**
   * Searches documents by title (client-side filtering)
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered array of document objects
   */
  async searchDocuments(query) {
    const documents = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();

    return documents.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(lowerQuery) ||
        doc.content?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Gets documents shared with the current user (not owned)
   * @param {string|number} userId - Current user's ID
   * @returns {Promise<Array>} Array of shared document objects
   */
  async getSharedDocuments(userId) {
    const allDocuments = await this.getAllDocuments();
    // Filter out documents where user is the owner (use string comparison)
    return allDocuments.filter((doc) => {
      const ownerId = String(doc.owner?.id || doc.ownerId || "");
      const currentUserId = String(userId || "");
      return ownerId !== currentUserId;
    });
  },

  /**
   * Gets documents owned by the current user
   * @param {string|number} userId - Current user's ID
   * @returns {Promise<Array>} Array of owned document objects
   */
  async getMyDocuments(userId) {
    const allDocuments = await this.getAllDocuments();
    // Filter documents where user is the owner (use string comparison)
    return allDocuments.filter((doc) => {
      const ownerId = String(doc.owner?.id || doc.ownerId || "");
      const currentUserId = String(userId || "");
      return ownerId === currentUserId;
    });
  },
};

export default documentService;
