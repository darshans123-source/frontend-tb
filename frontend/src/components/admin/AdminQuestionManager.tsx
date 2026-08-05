import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  Search,
  Check,
  X,
  HelpCircle,
  Stethoscope,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Level1Question } from '../../data/level1QuestionBank';
import { adminService } from '../../services/adminService';

export default function AdminQuestionManager() {
  const [questions, setQuestions] = useState<Level1Question[]>(() => adminService.getQuestionBank());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Level1Question | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Level1Question>>({
    type: 'theory',
    category: 'TB Basics',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: ''
  });

  const categories = Array.from(new Set(questions.map(q => q.category)));

  const handleRefresh = () => {
    setQuestions(adminService.getQuestionBank());
  };

  const handleOpenAddModal = () => {
    setFormData({
      id: `custom_${Date.now()}`,
      type: 'theory',
      category: 'TB Basics',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    });
    setEditingQuestion(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (q: Level1Question) => {
    setEditingQuestion(q);
    setFormData({ ...q, options: [...q.options] });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question from the active Level 1 Question Bank?')) {
      const updated = adminService.deleteQuestion(id);
      setQuestions(updated);
      setStatusMessage({ type: 'success', text: 'Question deleted successfully.' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.options || formData.options.some(o => !o.trim())) {
      alert('Please fill in the question and all 4 options.');
      return;
    }

    if (editingQuestion) {
      const updated = adminService.updateQuestion(editingQuestion.id, formData as Level1Question);
      setQuestions(updated);
      setStatusMessage({ type: 'success', text: 'Question updated successfully.' });
    } else {
      const newQ: Level1Question = {
        id: formData.id || `custom_${Date.now()}`,
        type: formData.type || 'theory',
        category: formData.category || 'General',
        question: formData.question,
        options: formData.options,
        correctIndex: Number(formData.correctIndex || 0),
        explanation: formData.explanation || '',
        ...(formData.type === 'scenario' && formData.patientScenario ? { patientScenario: formData.patientScenario } : {})
      };
      const updated = adminService.addQuestion(newQ);
      setQuestions(updated);
      setStatusMessage({ type: 'success', text: 'New question added to Question Bank.' });
    }

    setIsAddModalOpen(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = adminService.exportQuestions();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `level1_question_bank_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = adminService.importQuestions(importJsonText);
    if (result.success) {
      setQuestions(adminService.getQuestionBank());
      setIsImportModalOpen(false);
      setImportJsonText('');
      setStatusMessage({ type: 'success', text: result.message });
    } else {
      alert(result.message);
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-400" size={22} /> Level 1 Question Bank Manager
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active Question Bank: <strong className="text-cyan-400">{questions.length} Questions</strong> • Full 50-Question Assessment Coverage
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Refresh Question List"
          >
            <RefreshCw size={16} />
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download size={15} /> Export JSON
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload size={15} /> Import JSON
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
          statusMessage.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}><X size={14} /></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 outline-none font-mono"
        >
          <option value="all">All Categories ({questions.length})</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Questions Table / List */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">ID / Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Question</th>
              <th className="p-3">Correct Answer</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500 font-mono">
                  No matching questions found in question bank.
                </td>
              </tr>
            ) : (
              filteredQuestions.map((q, idx) => (
                <tr key={q.id || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono">
                    <span className="text-cyan-400 font-bold block">#{q.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                      q.type === 'scenario' ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}>
                      {q.type === 'scenario' ? 'Vignette' : 'Theory'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">
                    {q.category}
                  </td>
                  <td className="p-3 max-w-md leading-relaxed text-white">
                    {q.question}
                  </td>
                  <td className="p-3 text-emerald-400 font-mono font-semibold max-w-xs">
                    {q.options[q.correctIndex]}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 bg-slate-800 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="text-cyan-400" size={18} />
                {editingQuestion ? 'Edit Question' : 'Add New Question to Bank'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Question Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'theory' | 'scenario' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="theory">Core Theory</option>
                    <option value="scenario">Clinical Vignette (Scenario)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Diagnosis, Microbiology, NTEP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1">Question Text</label>
                <textarea
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the full question statement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-2">
                <label className="block text-slate-400 uppercase font-mono">Options (Select radio for correct answer)</label>
                {formData.options?.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctIndex === oIdx}
                      onChange={() => setFormData({ ...formData, correctIndex: oIdx })}
                      className="accent-cyan-500 w-4 h-4 shrink-0 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-400 w-4">{String.fromCharCode(65 + oIdx)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...(formData.options || [])];
                        newOpts[oIdx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1">Clinical Explanation</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Provide clinical rationale for the correct option..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="text-purple-400" size={18} /> Bulk Import Questions (JSON Format)
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <p className="text-slate-300">
                Paste a JSON array of Level 1 question objects below:
              </p>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[ { "id": "custom1", "type": "theory", "category": "TB Basics", "question": "...", "options": ["..."], "correctIndex": 0, "explanation": "..." } ]'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-[11px]"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md"
                >
                  Import Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
