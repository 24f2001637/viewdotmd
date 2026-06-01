import React, { useState } from 'react';
import { X, MessageSquare, Send, ChevronDown, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
}

type IssueType = 'bug' | 'suggestion' | 'question' | 'other';

const ISSUE_LABELS: Record<IssueType, string> = {
  bug: '🐛 Bug Report',
  suggestion: '💡 Feature Suggestion',
  question: '❓ Question',
  other: '💬 Other',
};

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [issueType, setIssueType] = useState<IssueType>('bug');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent(`[view.md] ${ISSUE_LABELS[issueType]}${name ? ` — from ${name}` : ''}`);
    const body = encodeURIComponent(
      `Type: ${ISSUE_LABELS[issueType]}\n` +
      (name  ? `Name: ${name}\n`  : '') +
      (email ? `Email: ${email}\n` : '') +
      `\n${message}`
    );

    window.location.href = `mailto:the.sahilbind@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="h-20 bg-gray-900 w-full flex items-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/10 rounded-lg">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">Send Feedback</h2>
              <p className="text-gray-400 text-xs mt-0.5">We read every message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
            aria-label="Close feedback"
          >
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your email app is opening!</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              We've pre-filled your message. Just hit Send in your email client and we'll get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Issue type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Type of feedback
              </label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={e => setIssueType(e.target.value as IssueType)}
                  className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 cursor-pointer pr-8"
                >
                  {(Object.keys(ISSUE_LABELS) as IssueType[]).map(key => (
                    <option key={key} value={key}>{ISSUE_LABELS[key]}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Name <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="For reply"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder-gray-300"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Describe the issue or share your thoughts..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 resize-none placeholder-gray-300"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!message.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              <Send size={14} />
              Send Feedback
            </button>

            <p className="text-center text-[11px] text-gray-400">
              Opens your email client · the.sahilbind@gmail.com
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
