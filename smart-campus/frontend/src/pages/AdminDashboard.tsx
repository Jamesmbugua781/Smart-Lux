import { useEffect, useState } from 'react'
import { AlertCircle, Building2, FileText, Loader2, Plus, ShieldCheck, Trash2, Upload } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { createInstitutionApi, deleteAdminDocApi, fetchAdminDocsApi, uploadAdminTextDocApi } from '../services/api'

interface DocumentItem {
  id: string
  filename: string
  file_type: string
  chunk_count: number
  uploaded_by: string
  created_at: string
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, token, activeInstitution, institutions, setActiveInstitution } = useAuth()

  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [docTitle, setDocTitle] = useState('')
  const [docContent, setDocContent] = useState('')
  const [fileType, setFileType] = useState('txt')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // New Institution Form State
  const [newInstId, setNewInstId] = useState('')
  const [newInstCode, setNewInstCode] = useState('')
  const [newInstName, setNewInstName] = useState('')
  const [newInstCity, setNewInstCity] = useState('')
  const [newInstDesc, setNewInstDesc] = useState('')
  const [isCreatingInst, setIsCreatingInst] = useState(false)

  const loadDocuments = async () => {
    try {
      const docs = await fetchAdminDocsApi(activeInstitution, token)
      setDocuments(docs || [])
    } catch (err) {
      console.warn('Failed to load documents:', err)
    }
  }

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/', { replace: true })
      return
    }
    void loadDocuments()
  }, [user, activeInstitution, token, navigate])

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Navbar />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <ShieldCheck size={48} className="mx-auto text-[var(--color-primary)]" />
          <h1 className="mt-4 text-2xl font-bold text-[#0B1F3A]">Admin Access Required</h1>
          <p className="mt-2 text-sm text-slate-600">Please sign in as an Institution Admin to access the Smart Lux Knowledge Portal.</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex rounded-xl bg-[#0B1F3A] px-5 py-2.5 text-xs font-semibold text-white">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docTitle.trim() || !docContent.trim()) return

    setError('')
    setMessage('')
    setIsUploading(true)

    try {
      await uploadAdminTextDocApi(docTitle.trim(), docContent.trim(), fileType, activeInstitution, token)
      setMessage(`Document "${docTitle}" uploaded and indexed successfully into RAG database!`)
      setDocTitle('')
      setDocContent('')
      void loadDocuments()
    } catch (err: any) {
      setError(err.message || 'Failed to upload document.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      await deleteAdminDocApi(docId, token)
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
      setMessage('Document deleted and vector embeddings purged.')
    } catch (err: any) {
      setError(err.message || 'Failed to delete document.')
    }
  }

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInstCode.trim() || !newInstName.trim()) return

    setError('')
    setMessage('')
    setIsCreatingInst(true)

    try {
      const instId = newInstId.trim() || newInstCode.trim().toLowerCase()
      await createInstitutionApi(instId, newInstCode.trim(), newInstName.trim(), newInstCity.trim(), newInstDesc.trim(), token)
      setMessage(`Institution "${newInstName}" created! Refreshing list...`)
      setNewInstId('')
      setNewInstCode('')
      setNewInstName('')
      setNewInstCity('')
      setNewInstDesc('')
      setActiveInstitution(instId)
    } catch (err: any) {
      setError(err.message || 'Failed to create institution.')
    } finally {
      setIsCreatingInst(false)
    }
  }

  const currentInstitutionObj = institutions.find((i) => i.id === activeInstitution)

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#0B1F3A]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              <ShieldCheck size={16} />
              Institution Admin Portal
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Document Knowledge & RAG Ingestion
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Upload university documents, course guidelines, or past paper advice for Smart Lux to retrieve.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-xs font-semibold text-[#0B1F3A] shadow-sm">
            <Building2 size={16} className="text-[var(--color-primary)] ml-1" />
            <select
              value={activeInstitution}
              onChange={(e) => setActiveInstitution(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0B1F3A] focus:outline-none cursor-pointer pr-2"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.code} - {inst.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alert Messages */}
        {message ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            ✅ {message}
          </div>
        ) : null}
        {error ? (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Document Upload & Knowledge Form */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#0B1F3A]/5 p-2.5 text-[var(--color-primary)]">
                  <Upload size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#0B1F3A]">Upload Document for RAG Training</h2>
                  <p className="text-xs text-slate-500">Paste text guidelines or upload guidelines for {currentInstitutionObj?.name}</p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title / Source Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DeKUT SCIT Lab Rules & Guidelines 2026.txt"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[#0B1F3A] placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[#0B1F3A] bg-white focus:border-[var(--color-primary)] focus:outline-none"
                    >
                      <option value="txt">Plain Text (.txt)</option>
                      <option value="json">Structured JSON (.json)</option>
                      <option value="pdf">PDF Document Text (.pdf)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Institution</label>
                    <input
                      type="text"
                      disabled
                      value={currentInstitutionObj?.code || 'DEKUT'}
                      className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Text / Guidelines Content</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Paste full campus policy, room directory, course details, or lab rules here..."
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-[#0B1F3A] placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] py-3 text-xs font-semibold text-white transition hover:bg-[#153460] disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  Index & Save Knowledge Vectors
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Active Documents Table & Add Institution */}
          <div className="space-y-6">
            {/* Uploaded Documents List */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-[var(--color-primary)]" />
                  <h2 className="text-base font-semibold text-[#0B1F3A]">Indexed Knowledge Files</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {documents.length} Files
                </span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
                    No uploaded documents for this institution yet. Use the form on the left to add one.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#f9faf9] p-3 text-xs transition hover:border-slate-200"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-[#0B1F3A] truncate">{doc.filename}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {doc.chunk_count} RAG Chunks • {doc.file_type.toUpperCase()} • {doc.created_at}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete document and vector embeddings"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Add New Institution Form */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Building2 size={18} className="text-[var(--color-primary)]" />
                <h2 className="text-base font-semibold text-[#0B1F3A]">Add New Institution</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">Register a new university or college for Smart Lux AI deployment.</p>

              <form onSubmit={handleCreateInstitution} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Code (e.g. TUM)</label>
                    <input
                      type="text"
                      required
                      placeholder="TUM"
                      value={newInstCode}
                      onChange={(e) => setNewInstCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City / Location</label>
                    <input
                      type="text"
                      required
                      placeholder="Mombasa"
                      value={newInstCity}
                      onChange={(e) => setNewInstCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Institution Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Technical University of Mombasa"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Premier technical university in Mombasa..."
                    value={newInstDesc}
                    onChange={(e) => setNewInstDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-[#0B1F3A] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingInst}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isCreatingInst ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Create & Enable Institution
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
