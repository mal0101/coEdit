/**
 * DocumentEditor.jsx
 *
 * Description: Main document editing page with real-time collaboration,
 * auto-save, share functionality, version history, and comments panel.
 *
 * Usage:
 *   <Route path="/document/:id" element={<DocumentEditor />} />
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import documentService from "../services/documentService";
import commentService from "../services/commentService";
import versionService from "../services/versionService";
import permissionService from "../services/permissionService";
import websocketService from "../services/websocketService";
import { formatRelativeTime, formatDateTime } from "../utils/formatters";
import { ACCESS_TYPES, STORAGE_KEYS } from "../utils/constants";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Dropdown from "../components/common/Dropdown";

/**
 * User presence indicator component
 */
function UserPresence({ users }) {
  const maxVisible = 3;
  const visibleUsers = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  const colors = [
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-pink-500",
  ];

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user, index) => (
        <div
          key={user.id || user.email || index}
          className={`w-8 h-8 rounded-full ${
            colors[index % colors.length]
          } flex items-center justify-center border-2 border-zinc-900 ring-2 ring-zinc-800/50`}
          title={user.name || user.email}
        >
          <span className="text-xs font-medium text-white">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-900">
          <span className="text-xs font-medium text-zinc-300">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Version history panel component
 */
function VersionHistoryPanel({ versions, onRestore, onClose, isLoading }) {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800/50 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <h3 className="font-semibold text-zinc-100">Version History</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No version history available
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="p-4 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {index === 0
                        ? "Current version"
                        : `Version ${versions.length - index}`}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {formatDateTime(version.timestamp || version.createdAt)}
                    </p>
                    {(version.editedBy || version.createdBy) && (
                      <p className="text-xs text-zinc-600 mt-1">
                        By{" "}
                        {version.editedBy?.name ||
                          version.createdBy ||
                          "Unknown"}
                      </p>
                    )}
                  </div>
                  {index !== 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onRestore(version)}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Comment item component
 */
function CommentItem({ comment, onDelete, canDelete }) {
  // Backend returns user object with name, or userName directly
  const userName = comment.user?.name || comment.userName || "Unknown";
  // Backend returns body, not content
  const commentBody = comment.body || comment.content || "";

  return (
    <div className="p-4 hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-cyan-400">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">{userName}</p>
            <p className="text-xs text-zinc-500">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-zinc-300 ml-11">{commentBody}</p>
    </div>
  );
}

/**
 * Comments panel component
 */
function CommentsPanel({
  comments,
  onAddComment,
  onDeleteComment,
  onClose,
  isLoading,
  currentUserId,
}) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800/50 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <h3 className="font-semibold text-zinc-100">Comments</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="p-4 border-b border-zinc-800/50">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl resize-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-zinc-100 placeholder-zinc-500 transition-all"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            loading={isSubmitting}
          >
            Comment
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No comments yet
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={onDeleteComment}
                canDelete={
                  String(comment.user?.id || comment.userId) ===
                  String(currentUserId)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Share modal component
 */
function ShareModal({ isOpen, onClose, documentId, permissions, onUpdate }) {
  const [email, setEmail] = useState("");
  const [accessType, setAccessType] = useState(ACCESS_TYPES.VIEWER);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState({});
  const { showSuccess, showError } = useNotification();

  const handleAddPermission = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsAdding(true);
    try {
      await permissionService.grantPermissionByEmail(
        documentId,
        email.trim(),
        accessType
      );
      setEmail("");
      onUpdate();
      showSuccess("Permission added successfully");
    } catch (err) {
      showError(err.message || "Failed to add permission");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePermission = async (permissionId) => {
    setIsRemoving((prev) => ({ ...prev, [permissionId]: true }));
    try {
      await permissionService.revokePermission(permissionId);
      onUpdate();
      showSuccess("Permission removed");
    } catch (err) {
      showError(err.message || "Failed to remove permission");
    } finally {
      setIsRemoving((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document" size="md">
      <div className="space-y-6">
        {/* Add new permission form */}
        <form onSubmit={handleAddPermission} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="px-3 py-2.5 border border-zinc-700/50 rounded-xl bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value={ACCESS_TYPES.VIEWER}>Viewer</option>
              <option value={ACCESS_TYPES.EDITOR}>Editor</option>
            </select>
          </div>
          <Button
            type="submit"
            fullWidth
            loading={isAdding}
            disabled={isAdding || !email.trim()}
          >
            Add
          </Button>
        </form>

        {/* Current permissions */}
        {permissions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-3">
              People with access
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {permissions.map((permission) => {
                const userName =
                  permission.user?.name ||
                  permission.userName ||
                  permission.user?.email ||
                  permission.email ||
                  "Unknown";
                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-cyan-400">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">
                          {userName}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">
                          {permission.accessType?.toLowerCase() || "viewer"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePermission(permission.id)}
                      disabled={isRemoving[permission.id]}
                      className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                    >
                      {isRemoving[permission.id] ? (
                        <Spinner size="sm" />
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/**
 * Document editor page component
 */
function DocumentEditor() {
  const { id: documentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Document state
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Panel states
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Data for panels
  const [versions, setVersions] = useState([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  // Collaboration state
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Refs
  const editorRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const lastContentRef = useRef("");

  /**
   * Checks if user has edit permission
   */
  const canEdit = useMemo(() => {
    if (!document || !user) {
      return false;
    }
    // Check if owner (owner can be object or just id)
    // Convert to string to handle type mismatches between number and string IDs
    const ownerId = String(document.owner?.id || document.ownerId || "");
    const userId = String(user.id || "");
    if (ownerId && userId && ownerId === userId) return true;
    // Check permissions - handle both userId and user.id formats
    const userPermission = permissions.find(
      (p) => String(p.user?.id || p.userId) === userId
    );
    return (
      userPermission?.accessType === ACCESS_TYPES.EDITOR ||
      userPermission?.accessType === ACCESS_TYPES.OWNER
    );
  }, [document, user, permissions]);

  /**
   * Fetches document data
   */
  const fetchDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      const doc = await documentService.getDocument(documentId);
      setDocument(doc);
      setContent(doc.content || "");
      setTitle(doc.title || "");
      lastContentRef.current = doc.content || "";
    } catch (err) {
      showError("Failed to load document");
      console.error("Error loading document:", err);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [documentId, navigate, showError]);

  /**
   * Fetches permissions
   * For document owners: gets all document permissions
   * For others: gets user's own permission for this document
   */
  const fetchPermissions = useCallback(async () => {
    if (!user || !document) return;

    try {
      // Check if current user is the owner
      const ownerId = String(document.owner?.id || document.ownerId || "");
      const userId = String(user.id || "");
      const isOwner = ownerId && userId && ownerId === userId;

      if (isOwner) {
        // Owners can fetch all permissions
        const perms = await permissionService.getDocumentPermissions(
          documentId
        );
        setPermissions(perms || []);
      } else {
        // Non-owners: get their own permissions and find the one for this document
        try {
          const userPerms = await permissionService.getUserPermissions(user.id);
          const docPermission = userPerms.find(
            (p) => String(p.document?.id || p.documentId) === String(documentId)
          );
          // Set as array with single permission if found
          setPermissions(docPermission ? [docPermission] : []);
        } catch (permErr) {
          console.error("Error fetching user permissions:", permErr);
          setPermissions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions([]);
    }
  }, [documentId, user, document]);

  /**
   * Fetches version history
   */
  const fetchVersions = useCallback(async () => {
    setVersionsLoading(true);
    try {
      const vers = await versionService.getVersionHistory(documentId);
      setVersions(vers || []);
    } catch (err) {
      console.error("Error fetching versions:", err);
    } finally {
      setVersionsLoading(false);
    }
  }, [documentId]);

  /**
   * Fetches comments
   */
  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const comms = await commentService.getDocumentComments(documentId);
      setComments(comms || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  }, [documentId]);

  /**
   * Saves document content
   */
  const saveDocument = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await documentService.updateDocument(documentId, { content, title });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastContentRef.current = content;
    } catch (err) {
      showError("Failed to save document");
      console.error("Error saving document:", err);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, content, title, hasUnsavedChanges, showError]);

  /**
   * Auto-save effect
   */
  useEffect(() => {
    if (hasUnsavedChanges) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDocument();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, saveDocument]);

  /**
   * Keyboard shortcut for save
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDocument();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveDocument]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  /**
   * Fetch permissions after document is loaded
   */
  useEffect(() => {
    if (document && user) {
      fetchPermissions();
    }
  }, [document, user, fetchPermissions]);

  /**
   * Fetch panel data when opened
   */
  useEffect(() => {
    if (showVersionHistory) {
      fetchVersions();
    }
  }, [showVersionHistory, fetchVersions]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  /**
   * WebSocket connection for real-time collaboration
   */
  useEffect(() => {
    if (!documentId || !user) return;

    const onConnect = () => {
      setIsConnected(true);

      // Subscribe to document edits
      websocketService.subscribeToDocumentUpdates(documentId, (message) => {
        if (message.userId !== user.id) {
          // Apply remote edit
          setContent((prevContent) => {
            // Simple merge - in production, use OT or CRDT
            if (message.content !== undefined) {
              return message.content;
            }
            return prevContent;
          });
        }
      });

      // Subscribe to user presence
      websocketService.subscribeToPresence(documentId, (message) => {
        if (message.type === "join") {
          setActiveUsers((prev) => {
            if (!prev.find((u) => u.id === message.userId)) {
              return [...prev, { id: message.userId, name: message.userName }];
            }
            return prev;
          });
        } else if (message.type === "leave") {
          setActiveUsers((prev) => prev.filter((u) => u.id !== message.userId));
        }
      });

      // Announce presence
      websocketService.sendPresence(documentId, {
        type: "join",
        userId: user.id,
        userName: user.name,
      });
    };

    const onError = (err) => {
      console.error("WebSocket connection error:", err);
      setIsConnected(false);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Connect with callbacks
    websocketService.connect(
      localStorage.getItem(STORAGE_KEYS.TOKEN),
      onConnect,
      onError,
      onDisconnect
    );

    return () => {
      // Cleanup WebSocket subscriptions
      try {
        if (websocketService.getConnectionStatus()) {
          websocketService.sendPresence(documentId, {
            type: "leave",
            userId: user.id,
            userName: user.name,
          });
        }
        websocketService.unsubscribeFromDocument(documentId);
      } catch (err) {
        console.error("Error during WebSocket cleanup:", err);
      }
    };
  }, [documentId, user]);

  /**
   * Handles content change
   */
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setHasUnsavedChanges(true);

    // Send edit to collaborators
    if (isConnected) {
      websocketService.sendEdit(documentId, {
        content: newContent,
        userId: user?.id,
      });
    }
  };

  /**
   * Handles title change
   */
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  /**
   * Restores a version
   */
  const handleRestoreVersion = async (version) => {
    try {
      await versionService.restoreVersion(version.id);
      setContent(version.content);
      setHasUnsavedChanges(true);
      showSuccess("Version restored");
      setShowVersionHistory(false);
    } catch (err) {
      showError("Failed to restore version");
      console.error("Error restoring version:", err);
    }
  };

  /**
   * Adds a comment
   */
  const handleAddComment = async (content) => {
    try {
      await commentService.createComment(documentId, content);
      fetchComments();
    } catch (err) {
      showError("Failed to add comment");
      console.error("Error adding comment:", err);
    }
  };

  /**
   * Deletes a comment
   */
  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showSuccess("Comment deleted");
    } catch (err) {
      showError("Failed to delete comment");
      console.error("Error deleting comment:", err);
    }
  };

  // Menu items for more dropdown
  const moreMenuItems = [
    {
      label: "Version History",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => {
        setShowComments(false);
        setShowVersionHistory(true);
      },
    },
    {
      label: "Comments",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      onClick: () => {
        setShowVersionHistory(false);
        setShowComments(true);
      },
    },
    { divider: true },
    {
      label: "Download",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      onClick: () => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = `${title || "document"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <div className="flex flex-col">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Untitled Document"
                className="text-lg font-medium text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 placeholder-zinc-600"
                disabled={!canEdit}
              />
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {isSaving ? (
                  <span>Saving...</span>
                ) : lastSaved ? (
                  <span>Saved {formatRelativeTime(lastSaved)}</span>
                ) : hasUnsavedChanges ? (
                  <span className="text-amber-500">Unsaved changes</span>
                ) : (
                  <span>All changes saved</span>
                )}
                {isConnected && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-500">Live</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Active users */}
            {activeUsers.length > 0 && <UserPresence users={activeUsers} />}

            {/* Share button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </Button>

            {/* More menu */}
            <Dropdown
              trigger={
                <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              }
              items={moreMenuItems}
              align="right"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 flex justify-center bg-zinc-900/50 p-8 overflow-auto">
          <div className="w-full max-w-4xl bg-zinc-900/80 shadow-xl shadow-black/20 rounded-xl border border-zinc-800/50">
            <textarea
              ref={editorRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing..."
              className="w-full h-full min-h-[calc(100vh-200px)] p-8 resize-none border-0 focus:outline-none focus:ring-0 text-zinc-100 leading-relaxed bg-transparent placeholder-zinc-600"
              disabled={!canEdit}
            />
          </div>
        </div>

        {/* Version history panel */}
        {showVersionHistory && (
          <VersionHistoryPanel
            versions={versions}
            onRestore={handleRestoreVersion}
            onClose={() => setShowVersionHistory(false)}
            isLoading={versionsLoading}
          />
        )}

        {/* Comments panel */}
        {showComments && (
          <CommentsPanel
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onClose={() => setShowComments(false)}
            isLoading={commentsLoading}
            currentUserId={user?.id}
          />
        )}
      </div>

      {/* Share modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentId={documentId}
        permissions={permissions}
        onUpdate={fetchPermissions}
      />
    </div>
  );
}

export default DocumentEditor;
