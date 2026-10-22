import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  X,
  CheckCircle2,
  Shield,
  Calendar,
  Filter,
  Star,
  Brain,
  Sparkles,
} from 'lucide-react';
import { JournalEntry } from '../../types';

interface JournalExportModalProps {
  entries: JournalEntry[];
  onClose: () => void;
}

export const JournalExportModal: React.FC<JournalExportModalProps> = ({
  entries,
  onClose,
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('pdf');
  const [filterScope, setFilterScope] = useState<'all' | 'favorites' | 'cbt' | 'gratitude'>('all');
  const [dateRange, setDateRange] = useState<'all' | '30days' | '7days'>('all');
  const [includeCbtDetails, setIncludeCbtDetails] = useState(true);
  const [includeMoodScores, setIncludeMoodScores] = useState(true);

  // Filter entries based on user selection
  const filteredEntries = entries.filter((entry) => {
    // Scope filter
    if (filterScope === 'favorites' && !entry.isFavorite) return false;
    if (filterScope === 'cbt' && !entry.cbtRecord && entry.promptCategory !== 'cbt') return false;
    if (filterScope === 'gratitude' && entry.promptCategory !== 'gratitude') return false;

    // Date range filter
    if (dateRange === '7days') {
      const sevenDaysAgo = Date.now() - 7 * 86400000;
      if (entry.timestamp < sevenDaysAgo) return false;
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = Date.now() - 30 * 86400000;
      if (entry.timestamp < thirtyDaysAgo) return false;
    }

    return true;
  });

  // 1. Export as CSV File
  const handleExportCSV = () => {
    const headers = [
      'Entry ID',
      'Date',
      'Title',
      'Category',
      'Mood Valence (1-5)',
      'Tags',
      'Journal Content',
      'CBT Situation',
      'CBT Automatic Thought',
      'CBT Distortion',
      'CBT Evidence For',
      'CBT Evidence Against',
      'CBT Rational Response',
      'Distress Before (1-10)',
      'Distress After (1-10)',
      'Is Favorite',
    ];

    const escapeCSV = (val: string | number | undefined | boolean) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredEntries.map((e) => [
      escapeCSV(e.id),
      escapeCSV(e.date),
      escapeCSV(e.title),
      escapeCSV(e.promptCategory),
      escapeCSV(e.valenceRating || ''),
      escapeCSV(e.tags.join(', ')),
      escapeCSV(e.content),
      escapeCSV(e.cbtRecord?.situation || ''),
      escapeCSV(e.cbtRecord?.automaticThought || ''),
      escapeCSV(e.cbtRecord?.distortion || ''),
      escapeCSV(e.cbtRecord?.evidenceFor || ''),
      escapeCSV(e.cbtRecord?.evidenceAgainst || ''),
      escapeCSV(e.cbtRecord?.rationalResponse || ''),
      escapeCSV(e.cbtRecord?.distressLevelBefore || ''),
      escapeCSV(e.cbtRecord?.distressLevelAfter || ''),
      escapeCSV(e.isFavorite ? 'Yes' : 'No'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AfyaMind_2036_Journal_Archive_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  // 2. Export as Secure Printable PDF Document
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up window blocked. Please allow pop-ups for this site to generate your PDF.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AfyaMind 2036 — Confidential Mental Wellness Journal</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.6;
      font-size: 11pt;
    }
    .header {
      border-bottom: 2px solid #064e3b;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .header-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    .header h1 {
      margin: 0;
      font-size: 20pt;
      color: #064e3b;
    }
    .header p {
      margin: 4px 0 0;
      font-size: 9pt;
      color: #78716c;
    }
    .confidential-box {
      background: #fafaf9;
      border: 1px dashed #d6d3d1;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 8.5pt;
      color: #57534e;
      margin-bottom: 25px;
    }
    .entry-card {
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 18px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .entry-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 9pt;
      color: #78716c;
    }
    .entry-category {
      font-weight: 700;
      text-transform: uppercase;
      color: #047857;
      background: #f0fdf4;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8pt;
    }
    .entry-title {
      font-size: 13pt;
      font-weight: 700;
      color: #1c1917;
      margin: 0 0 10px;
    }
    .entry-content {
      font-size: 10pt;
      white-space: pre-wrap;
      color: #292524;
      margin-bottom: 12px;
    }
    .cbt-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9pt;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .cbt-table th, .cbt-table td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
    }
    .cbt-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
      width: 25%;
    }
    .tags {
      margin-top: 10px;
      font-size: 8pt;
      color: #047857;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e7e5e4;
      font-size: 8pt;
      color: #a8a29e;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #064e3b; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Print Preview:</strong> Click 'Print to PDF' or use your browser's Print dialog to save.</div>
    <button onclick="window.print()" style="background: #34d399; color: #064e3b; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="header-badge">Vision 2036 • Health Archives</div>
    <h1>AfyaMind 2036 — Confidential Journal Archive</h1>
    <p>Founded by Nikolass Willy Mtunga (Coast Region &amp; Taita Taveta) • Generated on ${new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <div class="confidential-box">
    <strong>CONFIDENTIALITY NOTICE:</strong> This document contains private personal psychological reflections, cognitive restructuring logs, and emotional data recorded in the AfyaMind 2036 application. It is intended solely for personal self-care or privileged review with a licensed therapist.
  </div>

  <div class="entries-container">
    ${filteredEntries
      .map(
        (e) => `
      <div class="entry-card">
        <div class="entry-meta">
          <span class="entry-category">${e.promptCategory}</span>
          <span>${e.date}</span>
        </div>
        <div class="entry-title">${e.title}</div>
        <div class="entry-content">${e.content}</div>

        ${
          includeCbtDetails && e.cbtRecord
            ? `
          <table class="cbt-table">
            <tr>
              <th>Triggering Situation</th>
              <td>${e.cbtRecord.situation}</td>
            </tr>
            <tr>
              <th>Automatic Thought</th>
              <td>"${e.cbtRecord.automaticThought}"</td>
            </tr>
            <tr>
              <th>Identified Distortion</th>
              <td><strong>${e.cbtRecord.distortion}</strong></td>
            </tr>
            <tr>
              <th>Evidence Analysis</th>
              <td><strong>For:</strong> ${e.cbtRecord.evidenceFor || 'None noted'} <br><strong>Against:</strong> ${e.cbtRecord.evidenceAgainst || 'None noted'}</td>
            </tr>
            <tr>
              <th>Rational Alternative</th>
              <td><strong>${e.cbtRecord.rationalResponse}</strong></td>
            </tr>
            ${
              includeMoodScores
                ? `
            <tr>
              <th>Distress Reduction</th>
              <td>Distress dropped from <strong>${e.cbtRecord.distressLevelBefore}/10</strong> to <strong>${e.cbtRecord.distressLevelAfter}/10</strong></td>
            </tr>
            `
                : ''
            }
          </table>
        `
            : ''
        }

        ${
          e.tags && e.tags.length > 0
            ? `<div class="tags">Tags: ${e.tags.map((t) => '#' + t).join(' ')}</div>`
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>

  <div class="footer">
    AfyaMind 2036 • Kenya's Decadal Mental Healthcare Initiative • Page 1 of Archive • Total Records: ${filteredEntries.length}
  </div>

  <script>
    // Auto-trigger print dialog after layout render
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Export Private Journal Entries
              </h3>
              <p className="text-xs text-stone-500">
                Secure personal archives for offline backup or therapist sharing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  exportFormat === 'pdf' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                <Printer className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">Printable PDF</div>
                <div className="text-[10px] text-stone-500">Formatted charter with CBT tables</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                exportFormat === 'csv'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  exportFormat === 'csv' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">CSV Spreadsheet</div>
                <div className="text-[10px] text-stone-500">Excel, Google Sheets, or Data Analysis</div>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Scope */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Entries to Include
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'all', label: `All (${entries.length})` },
              { id: 'favorites', label: 'Favorites ★' },
              { id: 'cbt', label: 'CBT Only' },
              { id: 'gratitude', label: 'Gratitude' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setFilterScope(sc.id as typeof filterScope)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  filterScope === sc.id
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Date Period
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'All History' },
              { id: '30days', label: 'Last 30 Days' },
              { id: '7days', label: 'Last 7 Days' },
            ].map((dr) => (
              <button
                key={dr.id}
                type="button"
                onClick={() => setDateRange(dr.id as typeof dateRange)}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                  dateRange === dr.id
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {dr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-1 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
            <input
              type="checkbox"
              checked={includeCbtDetails}
              onChange={(e) => setIncludeCbtDetails(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
            />
            <span>Include structured CBT Cognitive Restructuring breakdowns</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
            <input
              type="checkbox"
              checked={includeMoodScores}
              onChange={(e) => setIncludeMoodScores(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
            />
            <span>Include distress metrics and emotional valence numbers</span>
          </label>
        </div>

        {/* Security & Summary Notice */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>{filteredEntries.length} entries</strong> selected for export. Files are created client-side on your device with zero data sent to external servers.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={exportFormat === 'pdf' ? handleExportPDF : handleExportCSV}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {exportFormat === 'pdf' ? (
              <>
                <Printer className="w-4 h-4" />
                <span>Generate PDF Charter</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download CSV File</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
