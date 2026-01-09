import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import documentService from "../services/documentService";
import versionService from "../services/versionService";
import { DEBOUNCE_DELAYS } from "../utils/constants";

const DocumentContext = createContext(null);

/**
 * Document provider component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function DocumentProvider({ children }) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveTimeoutRef = useRef(null);
  const originalContentRef = useRef(null);

  /**
   * Loads a document by ID
   * @param {string|number} id - Document ID
   * @returns {Promise<Object>} Document data
   */
  const loadDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await documentService.getDocument(id);
      setDocument(data);
      originalContentRef.current = data.content;
      setHasUnsavedChanges(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load document");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates document content locally
   * @param {string} content - New content
   */
  const updateContent = useCallback((content) => {
    setDocument((prev) => (prev ? { ...prev, content } : null));
    setHasUnsavedChanges(content !== originalContentRef.current);
  }, []);

  /**
   * Updates document title locally
   * @param {string} title - New title
   */
  const updateTitle = useCallback((title) => {
    setDocument((prev) => (prev ? { ...prev, title } : null));
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Saves the current document to the server
   * @returns {Promise<Object>} Updated document
   */
  const saveDocument = useCallback(async () => {
    if (!document) return null;

    setSaving(true);
    setError(null);

    try {
      const updated = await documentService.updateDocument(document.id, {
        title: document.title,
        content: document.content,
      });

      setDocument(updated);
      originalContentRef.current = updated.content;
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      return updated;
    } catch (err) {
      setError(err.message || "Failed to save document");
      throw err;
    } finally {
      setSaving(false);
    }
  }, [document]);

  /**
   * Auto-saves document with debouncing
   */
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (hasUnsavedChanges && document) {
        try {
          await saveDocument();
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    }, DEBOUNCE_DELAYS.AUTO_SAVE);
  }, [hasUnsavedChanges, document, saveDocument]);

  /**
   * Creates a version snapshot
   * @returns {Promise<Object>} Version data
   */
  const createVersion = useCallback(async () => {
    if (!document) return null;

    try {
      const version = await versionService.createVersion(
        document.id,
        document.title,
        document.content
      );
      return version;
    } catch (err) {
      setError(err.message || "Failed to create version");
      throw err;
    }
  }, [document]);

  /**
   * Restores document to a previous version
   * @param {string|number} versionId - Version ID
   * @returns {Promise<Object>} Restored document
   */
  const restoreVersion = useCallback(async (versionId) => {
    try {
      const restored = await versionService.restoreVersion(versionId);
      setDocument(restored);
      originalContentRef.current = restored.content;
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      return restored;
    } catch (err) {
      setError(err.message || "Failed to restore version");
      throw err;
    }
  }, []);

  /**
   * Clears the current document from state
   */
  const clearDocument = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setDocument(null);
    setError(null);
    setLastSaved(null);
    setHasUnsavedChanges(false);
    originalContentRef.current = null;
  }, []);

  /**
   * Applies a remote edit to the document
   * @param {Object} edit - Edit message from WebSocket
   */
  const applyRemoteEdit = useCallback((edit) => {
    setDocument((prev) => {
      if (!prev) return null;

      let newContent = prev.content;
      const { operation, cursorPosition, changeContent, length } = edit;

      switch (operation) {
        case "insert":
          newContent =
            prev.content.slice(0, cursorPosition) +
            changeContent +
            prev.content.slice(cursorPosition);
          break;
        case "delete":
          newContent =
            prev.content.slice(0, cursorPosition) +
            prev.content.slice(cursorPosition + length);
          break;
        case "replace":
          newContent =
            prev.content.slice(0, cursorPosition) +
            changeContent +
            prev.content.slice(cursorPosition + length);
          break;
        default:
          // Full content replacement
          if (changeContent !== undefined) {
            newContent = changeContent;
          }
      }

      return { ...prev, content: newContent };
    });
  }, []);

  const value = {
    document,
    loading,
    saving,
    error,
    lastSaved,
    hasUnsavedChanges,
    loadDocument,
    updateContent,
    updateTitle,
    saveDocument,
    autoSave,
    createVersion,
    restoreVersion,
    clearDocument,
    applyRemoteEdit,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

DocumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access document context
 * @returns {Object} Document context value
 * @throws {Error} If used outside DocumentProvider
 */
export function useDocument() {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }

  return context;
}

export default DocumentContext;
