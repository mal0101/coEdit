import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const permissionService = {
  /**
   * Grants permission to a user for a document
   * @param {string|number} documentId - Document ID
   * @param {string|number} userId - User ID to grant permission to
   * @param {string} accessType - Access type: 'VIEWER', 'EDITOR', or 'OWNER'
   * @returns {Promise<Object>} Created permission object
   */
  async grantPermission(documentId, userId, accessType) {
    const response = await api.post(API_ENDPOINTS.PERMISSIONS.GRANT, {
      document: { id: documentId },
      user: { id: userId },
      accessType,
    });
    return response.data;
  },

  /**
   * Revokes a permission
   * @param {string|number} permissionId - Permission ID to revoke
   * @returns {Promise<void>}
   */
  async revokePermission(permissionId) {
    await api.delete(API_ENDPOINTS.PERMISSIONS.REVOKE(permissionId));
  },

  /**
   * Gets all permissions for a user
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} Array of permission objects
   */
  async getUserPermissions(userId) {
    const response = await api.get(API_ENDPOINTS.PERMISSIONS.BY_USER(userId));
    return response.data;
  },

  /**
   * Gets all permissions for a document
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Array>} Array of permission objects
   */
  async getDocumentPermissions(documentId) {
    const response = await api.get(
      API_ENDPOINTS.PERMISSIONS.BY_DOCUMENT(documentId)
    );
    return response.data;
  },

  /**
   * Updates an existing permission's access type
   * @param {string|number} permissionId - Permission ID
   * @param {string} newAccessType - New access type
   * @returns {Promise<Object>} Updated permission object
   */
  async updatePermission(permissionId, newAccessType) {
    // Since API doesn't have update, we need to delete and re-grant
    // This is a workaround; ideally API would support PATCH
    const response = await api.put(`/api/permissions/${permissionId}`, {
      accessType: newAccessType,
    });
    return response.data;
  },

  /**
   * Checks if a user has specific access to a document
   * @param {string|number} documentId - Document ID
   * @param {string|number} userId - User ID
   * @param {string} requiredAccess - Required access type
   * @returns {Promise<boolean>} True if user has required access
   */
  async checkAccess(documentId, userId, requiredAccess) {
    try {
      const permissions = await this.getDocumentPermissions(documentId);
      const userPermission = permissions.find((p) => p.user?.id === userId);

      if (!userPermission) return false;

      const accessHierarchy = ["VIEWER", "EDITOR", "OWNER"];
      const userAccessIndex = accessHierarchy.indexOf(
        userPermission.accessType
      );
      const requiredAccessIndex = accessHierarchy.indexOf(requiredAccess);

      return userAccessIndex >= requiredAccessIndex;
    } catch {
      return false;
    }
  },

  /**
   * Gets a user by email (for adding collaborators)
   * @param {string} email - User's email
   * @returns {Promise<Object>} User object
   */
  async getUserByEmail(email) {
    const response = await api.get(API_ENDPOINTS.USERS.BY_EMAIL(email));
    return response.data;
  },

  /**
   * Grants permission by email address
   * @param {string|number} documentId - Document ID
   * @param {string} email - User's email
   * @param {string} accessType - Access type
   * @returns {Promise<Object>} Created permission object
   */
  async grantPermissionByEmail(documentId, email, accessType) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.id) {
      throw new Error("User not found");
    }
    return this.grantPermission(documentId, user.id, accessType);
  },
};

export default permissionService;
