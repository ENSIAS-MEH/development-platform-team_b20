import { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import {
  getComments,
  addComment,
  deleteComment,
  CURRENT_USER_ID,
} from "../../services/interactionService";

export default function CommentSection({ eventId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [eventId]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getComments(eventId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    const content = draft.trim();
    if (!content || posting) return;

    setPosting(true);
    setError(null);

    try {
      const newComment = await addComment(eventId, CURRENT_USER_ID, content);
      // Prepend the new comment (newest-first display)
      setComments((prev) => [newComment, ...prev]);
      setDraft("");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to post";
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    // Optimistic: remove from UI immediately
    const previous = comments;
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      await deleteComment(commentId, CURRENT_USER_ID);
    } catch (err) {
      // Revert on failure
      setComments(previous);
      const msg = err.response?.data?.error || "Failed to delete";
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter posts the comment
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePost();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold">
          Comments {!loading && `(${comments.length})`}
        </h3>
      </div>

      {/* Composer */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={1000}
          rows={3}
          placeholder="Write a comment... (Ctrl+Enter to post)"
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{draft.length}/1000</span>
          <button
            onClick={handlePost}
            disabled={!draft.trim() || posting}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white text-sm font-semibold transition-all shadow-lg shadow-primary-600/20"
          >
            <Send className="w-4 h-4" />
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 animate-fade-in">
          {error}
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-slate-500 text-center py-8">Loading comments...</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              canDelete={c.authorId === CURRENT_USER_ID}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentItem({ comment, canDelete, onDelete }) {
  const formatted = formatDate(comment.createdAt);

  return (
    <li className="bg-dark-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-7 h-7 rounded-full bg-primary-600/20 text-primary-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-300">
            User #{comment.authorId}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs">{formatted}</span>
        </div>

        {canDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-slate-200 mt-2 whitespace-pre-wrap break-words">
        {comment.content}
      </p>
    </li>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}