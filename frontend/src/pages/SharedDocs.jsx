/**
 * SharedDocs.jsx
 *
 * Description: Page showing documents shared with the current user
 * by other users, with access type indicators.
 *
 * Usage:
 *   <Route path="/shared" element={<SharedDocs />} />
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import documentService from "../services/documentService";
import { formatRelativeTime, truncateText } from "../utils/formatters";
import { ACCESS_TYPES } from "../utils/constants";
import Spinner from "../components/common/Spinner";

/**
 * Access badge component
 */
function AccessBadge({ accessType }) {
  const isEditor = accessType === ACCESS_TYPES.EDITOR;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
        isEditor
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50"
      }`}
    >
      {isEditor ? "Can edit" : "View only"}
    </span>
  );
}

/**
 * Shared document card component
 */
function SharedDocCard({ document, onOpen }) {
  return (
    <div
      className="group bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden cursor-pointer transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
      onClick={() => onOpen(document.id)}
    >
      {/* Document preview */}
      <div className="h-28 bg-zinc-800/30 border-b border-zinc-800/50 p-4 flex items-center justify-center">
        {document.content ? (
          <p className="text-xs text-zinc-400 line-clamp-4 text-left w-full leading-relaxed">
            {truncateText(document.content, 120)}
          </p>
        ) : (
          <div className="flex flex-col items-center text-zinc-600">
            <svg
              className="w-8 h-8 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs">Empty</span>
          </div>
        )}
      </div>

      {/* Document info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-zinc-100 truncate flex-1 group-hover:text-cyan-400 transition-colors">
            {document.title || "Untitled Document"}
          </h3>
          <AccessBadge accessType={document.accessType} />
        </div>

        <p className="text-xs text-zinc-500">
          {formatRelativeTime(document.updatedAt || document.createdAt)}
        </p>

        {/* Owner info */}
        <div className="flex items-center mt-3 pt-3 border-t border-zinc-800/50">
          <div className="w-6 h-6 bg-linear-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-medium text-white">
              {(document.owner?.name || document.ownerName || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-zinc-400 ml-2 truncate">
            {document.owner?.name || document.ownerName || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared document row component for list view
 */
function SharedDocRow({ document, onOpen }) {
  return (
    <div
      className="group flex items-center px-5 py-4 hover:bg-zinc-800/30 cursor-pointer border-b border-zinc-800/50 last:border-b-0 transition-colors"
      onClick={() => onOpen(document.id)}
    >
      {/* Icon */}
      <div className="shrink-0 mr-4">
        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
          <svg
            className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Title and owner */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-zinc-100 truncate group-hover:text-cyan-400 transition-colors">
          {document.title || "Untitled Document"}
        </h3>
        <p className="text-xs text-zinc-500">
          {document.owner?.name || document.ownerName || "Unknown"}
        </p>
      </div>

      {/* Access type */}
      <div className="shrink-0 mx-4">
        <AccessBadge accessType={document.accessType} />
      </div>

      {/* Last edited */}
      <div className="shrink-0 w-32 text-xs text-zinc-500 hidden md:block text-right">
        {formatRelativeTime(document.updatedAt || document.createdAt)}
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        No shared documents
      </h3>
      <p className="text-sm text-zinc-500 max-w-xs mx-auto">
        When someone shares a document with you, it will appear here
      </p>
    </div>
  );
}

/**
 * Shared documents page component
 */
function SharedDocs() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccess, setFilterAccess] = useState("all");

  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  const fetchSharedDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await documentService.getSharedDocuments(user.id);
      setDocuments(data || []);
    } catch (err) {
      showError("Failed to load shared documents");
      console.error("Error fetching shared documents:", err);
    } finally {
      setLoading(false);
    }
  }, [showError, user?.id]);

  useEffect(() => {
    fetchSharedDocuments();
  }, [fetchSharedDocuments]);

  const handleOpenDocument = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  const filteredDocuments = documents
    .filter((doc) => {
      if (
        searchQuery &&
        !doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (filterAccess === "editor" && doc.accessType !== ACCESS_TYPES.EDITOR) {
        return false;
      }
      if (filterAccess === "viewer" && doc.accessType !== ACCESS_TYPES.VIEWER) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">
                Shared with me
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {documents.length}{" "}
                {documents.length === 1 ? "document" : "documents"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-900/50 border border-zinc-800/50 text-zinc-100 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              className="px-4 py-3 text-sm bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
            >
              <option value="all">All access</option>
              <option value="editor">Can edit</option>
              <option value="viewer">View only</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
              <button
                className={`p-3 transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                className={`p-3 transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
                onClick={() => setViewMode("list")}
                title="List view"
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          searchQuery || filterAccess !== "all" ? (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-12 text-center">
              <p className="text-zinc-400 text-sm">
                No documents match your filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterAccess("all");
                }}
                className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50">
              <EmptyState />
            </div>
          )
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => (
              <SharedDocCard
                key={doc.id}
                document={doc}
                onOpen={handleOpenDocument}
              />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden">
            <div className="flex items-center px-5 py-3 bg-zinc-800/30 border-b border-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="shrink-0 mr-4 w-10" />
              <div className="flex-1">Name</div>
              <div className="shrink-0 mx-4 w-24">Access</div>
              <div className="shrink-0 w-32 hidden md:block text-right">
                Modified
              </div>
            </div>
            {filteredDocuments.map((doc) => (
              <SharedDocRow
                key={doc.id}
                document={doc}
                onOpen={handleOpenDocument}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedDocs;
