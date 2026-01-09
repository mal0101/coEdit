import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const versionService = {
  /**
   * Gets version history for a document
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Array>} Array of version history objects
   */
  async getVersionHistory(documentId) {
    const response = await api.get(
      API_ENDPOINTS.HISTORY.BY_DOCUMENT(documentId)
    );
    return response.data;
  },

  /**
   * Gets a specific version by ID
   * @param {string|number} versionId - Version ID
   * @returns {Promise<Object>} Version history object with content
   */
  async getVersion(versionId) {
    const response = await api.get(API_ENDPOINTS.HISTORY.BY_ID(versionId));
    return response.data;
  },

  /**
   * Creates a new version snapshot
   * @param {string|number} documentId - Document ID
   * @param {string} title - Document title at snapshot time
   * @param {string} content - Document content at snapshot time
   * @returns {Promise<Object>} Created version history object
   */
  async createVersion(documentId, title, content) {
    const response = await api.post(API_ENDPOINTS.HISTORY.BASE, {
      document: { id: documentId },
      title,
      content,
    });
    return response.data;
  },

  /**
   * Restores a document to a previous version
   * @param {string|number} versionId - Version ID to restore
   * @returns {Promise<Object>} Restored document object
   */
  async restoreVersion(versionId) {
    const response = await api.post(API_ENDPOINTS.HISTORY.RESTORE(versionId));
    return response.data;
  },

  /**
   * Gets the latest version for a document
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Object|null>} Latest version or null if no history
   */
  async getLatestVersion(documentId) {
    const history = await this.getVersionHistory(documentId);
    if (!history || history.length === 0) return null;

    // Sort by timestamp descending and return first
    const sorted = history.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return sorted[0];
  },

  /**
   * Compares two versions (for diff view)
   * @param {string|number} versionId1 - First version ID
   * @param {string|number} versionId2 - Second version ID
   * @returns {Promise<Object>} Object with both version contents
   */
  async compareVersions(versionId1, versionId2) {
    const [version1, version2] = await Promise.all([
      this.getVersion(versionId1),
      this.getVersion(versionId2),
    ]);

    return {
      version1,
      version2,
      diff: {
        titleChanged: version1.title !== version2.title,
        contentChanged: version1.content !== version2.content,
      },
    };
  },
};

export default versionService;
