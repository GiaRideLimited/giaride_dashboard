import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const getDocLabel = (doc) =>
    (doc.document_type || doc.type || doc.name || doc.label || 'Document')
        .toString()
        .replace(/_/g, ' ');

const getDocUrl = (doc) =>
    doc.url || doc.document_url || doc.file_url || doc.file || doc.image || doc.link || null;

const isPdf = (url) => typeof url === 'string' && /\.pdf($|\?)/i.test(url);

const docStatusClass = (status) =>
    status === 'approved'
        ? 'bg-green-100 text-green-700'
        : status === 'rejected'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700';

const DriverDocumentsTab = ({ reference, driver, BASE_URL, onDriverRefresh }) => {
    const [documents, setDocuments] = useState([]);
    const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
    const [documentsError, setDocumentsError] = useState(null);
    const [documentStatusFilter, setDocumentStatusFilter] = useState('pending');
    const [documentActionLoading, setDocumentActionLoading] = useState({});

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    const fetchDocuments = () => {
        if (!reference) return;
        setIsDocumentsLoading(true);
        setDocumentsError(null);
        const endpoint = `${BASE_URL}/admin/driver-documents/${reference}?page=1&size=50&status=${documentStatusFilter}`;

        fetch(endpoint, { headers: getAuthHeaders() })
            .then((response) => {
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                return response.json();
            })
            .then((jsonData) => {
                console.log('driver documents response', jsonData);
                const list = jsonData?.data?.data || jsonData?.data?.documents || jsonData?.data || jsonData || [];
                setDocuments(Array.isArray(list) ? list : []);
                setIsDocumentsLoading(false);
            })
            .catch((err) => {
                console.error('Documents fetch error:', err);
                setDocumentsError(err.message || 'Failed to load documents');
                setIsDocumentsLoading(false);
            });
    };

    useEffect(() => {
        if (reference) fetchDocuments();
    }, [reference, documentStatusFilter]);

    const handleDocumentStatus = (doc, action) => {
        const documentId = doc.id;
        if (documentId === undefined || documentId === null) {
            toast.error('This document has no ID, so it cannot be reviewed');
            return;
        }

        const body = { status: action };
        if (action === 'rejected') {
            const reason = window.prompt('Reason for rejection:');
            if (!reason || !reason.trim()) {
                toast.error('A reason is required to reject a document');
                return;
            }
            body.reason = reason.trim();
        }

        setDocumentActionLoading((prev) => ({ ...prev, [documentId]: action }));
        const endpoint = `${BASE_URL}/admin/driver-document/${documentId}`;

        toast.promise(
            fetch(endpoint, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Failed to ${action === 'approved' ? 'approve' : 'reject'} document (${response.status})`
                        );
                    }
                    return response.json();
                })
                .then(() => {
                    fetchDocuments();
                    if (onDriverRefresh) onDriverRefresh();
                })
                .finally(() => {
                    setDocumentActionLoading((prev) => {
                        const updated = { ...prev };
                        delete updated[documentId];
                        return updated;
                    });
                }),
            {
                loading: `${action === 'approved' ? 'Approving' : 'Rejecting'} document...`,
                success: `Document ${action === 'approved' ? 'approved' : 'rejected'} successfully!`,
                error: (err) => err.message,
            }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Overall status + filter */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">Document Status</h3>
                        <p className="text-xs text-gray-500">Overall verification status of documents</p>
                    </div>
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${driver.document_status === 'approved' || driver.verified
                                ? 'bg-green-100 text-green-700'
                                : driver.document_status === 'rejected' || driver.document_status === 'declined'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}
                    >
                        {driver.document_status || (driver.verified ? 'Approved' : 'Pending/Unverified')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {['pending', 'approved', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setDocumentStatusFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer
                                ${documentStatusFilter === s
                                    ? 'bg-black text-white'
                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Document grid */}
            {isDocumentsLoading ? (
                <div className="flex justify-center items-center gap-2 py-16">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                    <span className="text-gray-400 text-sm">Loading documents...</span>
                </div>
            ) : documentsError ? (
                <div className="py-16 text-center">
                    <p className="text-red-500 text-sm mb-3">Could not load documents: {documentsError}</p>
                    <button onClick={fetchDocuments} className="text-blue-500 text-sm hover:underline cursor-pointer">
                        Try again
                    </button>
                </div>
            ) : documents.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm font-medium">
                    No {documentStatusFilter} documents.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc, idx) => {
                        const url = getDocUrl(doc);
                        const label = getDocLabel(doc);
                        const loadingAction = documentActionLoading[doc.id];

                        return (
                            <div
                                key={doc.id ?? idx}
                                className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col"
                            >
                                {/* Card header */}
                                <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center gap-2">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide truncate">
                                            {label}
                                        </span>
                                        {doc.status && (
                                            <span
                                                className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${docStatusClass(doc.status)}`}
                                            >
                                                {doc.status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => handleDocumentStatus(doc, 'approved')}
                                            disabled={!!loadingAction}
                                            title="Approve document"
                                            className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {loadingAction === 'approved' ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600" />
                                            ) : (
                                                <FiCheck size={13} strokeWidth={2.5} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDocumentStatus(doc, 'rejected')}
                                            disabled={!!loadingAction}
                                            title="Reject document"
                                            className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {loadingAction === 'rejected' ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500" />
                                            ) : (
                                                <FiX size={13} strokeWidth={2.5} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Document preview */}
                                <div className="p-4 flex-grow flex items-center justify-center bg-gray-50/30 min-h-[160px]">
                                    {url ? (
                                        isPdf(url) ? (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-semibold text-blue-500 hover:underline"
                                            >
                                                Open PDF
                                            </a>
                                        ) : (
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                <img
                                                    src={url}
                                                    alt={label}
                                                    className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer border border-gray-200"
                                                />
                                            </a>
                                        )
                                    ) : (
                                        <span className="text-sm text-gray-400 font-medium">No file</span>
                                    )}
                                </div>

                                {/* Rejection reason */}
                                {doc.status === 'rejected' && (doc.reason || doc.rejection_reason) && (
                                    <div className="px-4 py-3 border-t border-gray-100 bg-red-50/50 text-xs text-red-600">
                                        <span className="font-bold">Reason: </span>
                                        {doc.reason || doc.rejection_reason}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DriverDocumentsTab;

