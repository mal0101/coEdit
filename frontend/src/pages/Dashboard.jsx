/**
 * Dashboard.jsx
 *
 * Description: Main dashboard page showing user's documents in grid/list view,
 * with create new document functionality and document management.
 *
 * Usage:
 *   <Route path="/dashboard" element={<Dashboard />} />
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import documentService from "../services/documentService";
import { formatRelativeTime, truncateText } from "../utils/formatters";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import Dropdown from "../components/common/Dropdown";

/**
 * Document card component for grid view
 */
function DocumentCard({ document, onOpen, onDelete, onRename }) {
  const menuItems = [
    {
      label: "Open",
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
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      ),
      onClick: () => onOpen(document.id),
    },
    {
      label: "Rename",
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: () => onRename(document),
    },
    { divider: true },
    {
      label: "Delete",
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: () => onDelete(document),
      danger: true,
    },
  ];

  return (
    <div
      className="group relative bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-zinc-800/50 cursor-pointer transition-all duration-300 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5"
      onClick={() => onOpen(document.id)}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-px bg-linear-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

      {/* Card content wrapper */}
      <div className="relative bg-zinc-900/90 rounded-2xl">
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyan-500 via-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

        {/* Document preview */}
        <div className="h-36 bg-linear-to-br from-zinc-800/80 to-zinc-900/80 p-4 flex items-center justify-center relative overflow-hidden rounded-t-2xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/[0.02] to-transparent" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
          {document.content ? (
            <p className="relative text-xs text-zinc-400 line-clamp-5 text-left w-full leading-relaxed font-mono">
              {truncateText(document.content, 150)}
            </p>
          ) : (
            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-2 ring-1 ring-zinc-700/50">
                <svg
                  className="w-7 h-7 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <span className="text-xs text-zinc-600 font-medium">
                Empty document
              </span>
            </div>
          )}
        </div>

        {/* Document info */}
        <div className="p-4 bg-zinc-900/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors">
                {document.title || "Untitled Document"}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg
                  className="w-3.5 h-3.5 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-zinc-500">
                  {formatRelativeTime(document.updatedAt || document.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions dropdown */}
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown
                trigger={
                  <button className="p-1.5 rounded-lg hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all">
                    <svg
                      className="w-4 h-4 text-zinc-500"
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
                items={menuItems}
                align="right"
              />
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center mt-3 pt-3 border-t border-zinc-800/50">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center ring-2 ring-zinc-900 shadow-lg shadow-cyan-500/20">
              <span className="text-[10px] font-bold text-white">
                {(document.owner?.name || document.ownerName || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-500 ml-2 truncate">
              {document.owner?.name || document.ownerName || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Document row component for list view
 */
function DocumentRow({ document, onOpen, onDelete, onRename }) {
  const menuItems = [
    { label: "Open", onClick: () => onOpen(document.id) },
    { label: "Rename", onClick: () => onRename(document) },
    { divider: true },
    { label: "Delete", onClick: () => onDelete(document), danger: true },
  ];

  return (
    <div
      className="group flex items-center px-5 py-4 hover:bg-zinc-800/30 cursor-pointer border-b border-zinc-800/50 last:border-b-0 transition-all relative"
      onClick={() => onOpen(document.id)}
    >
      {/* Hover accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

      {/* Icon */}
      <div className="shrink-0 mr-4">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-800/50 flex items-center justify-center group-hover:from-cyan-500/20 group-hover:to-teal-500/10 transition-all ring-1 ring-zinc-700/50 group-hover:ring-cyan-500/30">
          <svg
            className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
      </div>

      {/* Title & Owner */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors">
          {document.title || "Untitled Document"}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-4 h-4 rounded-full bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">
              {(document.owner?.name || document.ownerName || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-zinc-500">
            {document.owner?.name || document.ownerName || "Unknown"}
          </span>
        </div>
      </div>

      {/* Last edited */}
      <div className="shrink-0 w-36 text-xs text-zinc-500 hidden md:flex items-center gap-1.5 justify-end">
        <svg
          className="w-3.5 h-3.5"
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
        {formatRelativeTime(document.updatedAt || document.createdAt)}
      </div>

      {/* Actions */}
      <div className="shrink-0 ml-3" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all">
              <svg
                className="w-4 h-4 text-zinc-500"
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
          items={menuItems}
          align="right"
        />
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ onCreateNew }) {
  return (
    <div className="text-center py-20 px-4">
      {/* Creative illustration */}
      <div className="relative w-56 h-56 mx-auto mb-10">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-linear-to-br from-cyan-500/10 to-teal-500/5 blur-2xl" />
        </div>

        {/* Outer ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full border border-dashed border-zinc-700/50 animate-[spin_30s_linear_infinite]" />
        </div>

        {/* Inner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-zinc-800/50" />
        </div>

        {/* Floating document cards */}
        <div className="absolute top-2 left-8 w-14 h-18 bg-zinc-800/80 rounded-xl shadow-xl transform -rotate-12 flex flex-col p-2.5 border border-zinc-700/50 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite]">
          <div className="w-6 h-1.5 bg-zinc-600 rounded mb-1.5" />
          <div className="w-8 h-1 bg-zinc-700/60 rounded mb-1" />
          <div className="w-5 h-1 bg-zinc-700/60 rounded" />
        </div>
        <div className="absolute top-6 right-6 w-14 h-18 bg-zinc-800/80 rounded-xl shadow-xl transform rotate-12 flex flex-col p-2.5 border border-cyan-500/30 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite_0.5s]">
          <div className="w-6 h-1.5 bg-cyan-500/50 rounded mb-1.5" />
          <div className="w-8 h-1 bg-cyan-500/30 rounded mb-1" />
          <div className="w-5 h-1 bg-cyan-500/30 rounded" />
        </div>
        <div className="absolute bottom-8 left-12 w-12 h-16 bg-zinc-800/60 rounded-lg shadow-lg transform rotate-6 flex flex-col p-2 border border-zinc-700/30 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite_1s]">
          <div className="w-5 h-1 bg-zinc-600/50 rounded mb-1" />
          <div className="w-6 h-0.5 bg-zinc-700/40 rounded" />
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 ring-4 ring-zinc-950">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-zinc-100 mb-3">
        Start your first document
      </h3>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
        Create and collaborate on documents in real-time with your team. Your
        workspace is ready!
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center px-8 py-3.5 bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-teal-400 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1"
      >
        <svg
          className="w-5 h-5 mr-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Document
      </button>
    </div>
  );
}

/**
 * Dashboard page component
 */
function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data || []);
    } catch (err) {
      showError("Failed to load documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleOpenDocument = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      showError("Please enter a document title");
      return;
    }

    setIsCreating(true);
    try {
      const newDoc = await documentService.createDocument(
        newDocTitle.trim(),
        ""
      );
      setDocuments((prev) => [newDoc, ...prev]);
      setCreateModalOpen(false);
      setNewDocTitle("");
      showSuccess("Document created successfully");
      navigate(`/document/${newDoc.id}`);
    } catch (err) {
      showError("Failed to create document");
      console.error("Error creating document:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setDeleteModalOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    setIsDeleting(true);
    try {
      await documentService.deleteDocument(selectedDocument.id);
      setDocuments((prev) => prev.filter((d) => d.id !== selectedDocument.id));
      setDeleteModalOpen(false);
      setSelectedDocument(null);
      showSuccess("Document deleted successfully");
    } catch (err) {
      showError("Failed to delete document");
      console.error("Error deleting document:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameClick = (document) => {
    setSelectedDocument(document);
    setNewDocTitle(document.title || "");
    setRenameModalOpen(true);
  };

  const handleRenameDocument = async () => {
    if (!selectedDocument || !newDocTitle.trim()) return;

    setIsRenaming(true);
    try {
      await documentService.updateDocument(selectedDocument.id, {
        title: newDocTitle.trim(),
      });
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === selectedDocument.id ? { ...d, title: newDocTitle.trim() } : d
        )
      );
      setRenameModalOpen(false);
      setSelectedDocument(null);
      setNewDocTitle("");
      showSuccess("Document renamed successfully");
    } catch (err) {
      showError("Failed to rename document");
      console.error("Error renaming document:", err);
    } finally {
      setIsRenaming(false);
    }
  };

  const filteredDocuments = documents
    .filter((doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "updatedAt":
        default:
          return (
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
          );
      }
    });

  // Calculate quick stats
  const recentDocs = documents.filter((d) => {
    const updated = new Date(d.updatedAt || d.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return updated > weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-500/[0.02] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">My Documents</h1>
              <p className="text-sm text-zinc-500 mt-1">
                {documents.length}{" "}
                {documents.length === 1 ? "document" : "documents"} •{" "}
                {recentDocs} updated this week
              </p>
            </div>
            <button
              onClick={() => {
                setNewDocTitle("");
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-teal-400 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Document
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {documents.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Documents Card */}
            <div className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center ring-1 ring-cyan-500/20">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">
                    {documents.length}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 mt-0.5">
                    Total Documents
                  </p>
                </div>
              </div>
            </div>

            {/* Updated This Week Card */}
            <div className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">
                    {recentDocs}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 mt-0.5">
                    Updated This Week
                  </p>
                </div>
              </div>
            </div>

            {/* With Content Card */}
            <div className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center ring-1 ring-amber-500/20">
                  <svg
                    className="w-6 h-6 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">
                    {documents.filter((d) => d.content).length}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 mt-0.5">
                    With Content
                  </p>
                </div>
              </div>
            </div>

            {/* Empty Drafts Card */}
            <div className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 hover:border-sky-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-500/20 to-sky-600/10 flex items-center justify-center ring-1 ring-sky-500/20">
                  <svg
                    className="w-6 h-6 text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h-3m3 0h-3m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-100 tracking-tight">
                    {documents.filter((d) => !d.content).length}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 mt-0.5">
                    Empty Drafts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
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
              placeholder="Search documents..."
              className="w-full pl-12 pr-4 py-3 text-sm bg-zinc-900/50 border border-zinc-800/50 text-zinc-100 placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              className="px-4 py-3 text-sm bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updatedAt">Last modified</option>
              <option value="createdAt">Date created</option>
              <option value="title">Name</option>
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
                  className="w-5 h-5"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 w-20 h-20 bg-cyan-500/30 rounded-3xl blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <svg
                  className="w-10 h-10 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Spinner size="lg" />
            </div>
            <p className="text-zinc-400 mt-4 font-medium">
              Loading your documents...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          searchQuery ? (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-zinc-500"
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
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                No results found
              </h3>
              <p className="text-zinc-400 mb-6">
                No documents match "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50">
              <EmptyState
                onCreateNew={() => {
                  setNewDocTitle("");
                  setCreateModalOpen(true);
                }}
              />
            </div>
          )
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onOpen={handleOpenDocument}
                onDelete={handleDeleteClick}
                onRename={handleRenameClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden">
            <div className="flex items-center px-5 py-3 bg-zinc-800/30 border-b border-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="shrink-0 mr-4 w-10" />
              <div className="flex-1">Document</div>
              <div className="shrink-0 w-36 hidden md:block text-right">
                Last Modified
              </div>
              <div className="shrink-0 ml-3 w-8" />
            </div>
            {filteredDocuments.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onOpen={handleOpenDocument}
                onDelete={handleDeleteClick}
                onRename={handleRenameClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="New Document"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Document title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDocument}
              loading={isCreating}
              disabled={isCreating || !newDocTitle.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Document"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete "
            {selectedDocument?.title || "Untitled Document"}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteDocument}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Document"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="New title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameDocument}
              loading={isRenaming}
              disabled={isRenaming || !newDocTitle.trim()}
            >
              Rename
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
