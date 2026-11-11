import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['pending', 'approved', 'rejected'];
const PAGE_SIZE = 12;

// Document types the backend uses going forward (enum) and how to display them
const DOC_TYPE_LABELS = {
    nin: 'NIN',
    cac: 'CAC',
    pvc: 'PVC',
    bvn: 'BVN',
    drivers_license: "Driver's License",
    passport: 'Passport',
};

// Older/free-text names mapped to the enum value
const DOC_TYPE_ALIASES = {
    driver_license: 'drivers_license',
    drivers_licence: 'drivers_license',
    driver_licence: 'drivers_license',
    driving_license: 'drivers_license',
    driving_licence: 'drivers_license',
    national_id: 'nin',
    national_identification_number: 'nin',
    voters_card: 'pvc',
    voter_card: 'pvc',
    permanent_voters_card: 'pvc',
    international_passport: 'passport',
    bank_verification_number: 'bvn',
};

// Normalize whatever the API sends into one of the enum values:
// "Driver's license", "drivers license", "DRIVERS_LICENSE" -> "drivers_license"
const normalizeDocType = (name) => {
    if (!name) return '';
    const key = name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[\s-]+/g, '_')
        .replace(/_+/g, '_');
    return DOC_TYPE_ALIASES[key] || key;
};

// Readable label for a document type; unknown values fall back to Title Case
const formatDocName = (name) => {
    const type = normalizeDocType(name);
    if (!type) return 'Document';
    return (
        DOC_TYPE_LABELS[type] ||
        type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    );
};

// Cloudinary returns http:// links; load them over https to avoid mixed-content blocking
const safeUrl = (url) =>
    typeof url === 'string' && url ? url.replace(/^http:\/\/res\.cloudinary\.com/i, 'https://res.cloudinary.com') : null;

const isPdf = (url) => typeof url === 'string' && /\.pdf($|\?)/i.test(url);

// Always shows Front and Back (even if they share the same URL).
// Falls back to fileUrl only when neither front nor back exists.
const getDocFiles = (doc) => {
    const sides = [
        { label: 'Front', url: safeUrl(doc.id_card_front) },
        { label: 'Back', url: safeUrl(doc.id_card_back) },
    ].filter((f) => f.url);

    if (sides.length > 0) return sides;

    const file = safeUrl(doc.fileUrl);
    return file ? [{ label: 'File', url: file }] : [];
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return isNaN(d) ? 'N/A' : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const docStatusClass = (status) =>
    status === 'approved'
        ? 'bg-green-100 text-green-700'
        : status === 'rejected'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700';

const FilePreview = ({ label, url, alt }) => {
    const [broken, setBroken] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            {isPdf(url) ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-32 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-blue-500 hover:underline"
                >
                    Open PDF <FiExternalLink size={13} />
                </a>
            ) : broken ? (
                <div className="h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400">
                    Preview unavailable
                </div>
            ) : (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                        src={url}
                        alt={`${alt} - ${label}`}
                        onError={() => setBroken(true)}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
                    />
                </a>
            )}
        </div>
    );
};

const DriverDocumentsTab = ({ reference, driver, BASE_URL, onDriverRefresh }) => {
    const [documents, setDocuments] = useState([]);
    const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
    const [documentsError, setDocumentsError] = useState(null);
    const [documentStatusFilter, setDocumentStatusFilter] = useState('pending');
    const [documentActionLoading, setDocumentActionLoading] = useState({});
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

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

        const params = new URLSearchParams({
            page: String(page),
            size: String(PAGE_SIZE),
            status: documentStatusFilter,
        });
        const endpoint = `${BASE_URL}/admin/driver-documents/${reference}?${params}`;

        fetch(endpoint, { headers: getAuthHeaders() })
            .then((response) => {
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                return response.json();
            })
            .then((jsonData) => {
                // Response shape: { success, message, data: { total, count, data: [...], totalPages, currentPage } }
                const payload = jsonData?.data || {};
                const list = Array.isArray(payload.data) ? payload.data : [];
                setDocuments(list);
                setPagination({
                    total: payload.total ?? list.length,
                    totalPages: Math.max(payload.totalPages || 1, 1),
                    currentPage: payload.currentPage || page,
                });
            })
            .catch((err) => {
                console.error('Documents fetch error:', err);
                setDocumentsError(err.message || 'Failed to load documents');
                setDocuments([]);
            })
            .finally(() => setIsDocumentsLoading(false));
    };

    useEffect(() => {
        fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference, documentStatusFilter, page]);

    const changeFilter = (status) => {
        if (status === documentStatusFilter) return;
        setPage(1);
        setDocumentStatusFilter(status);
    };

    const handleDocumentStatus = (doc, action) => {
        const documentId = doc.id;
        if (documentId === undefined || documentId === null) {
            toast.error('This document has no ID, so it cannot be reviewed');
            return;
        }

        const body = { status: action };
        if (action === 'rejected') {
            const reason = window.prompt('Reason for rejection:');
            if (reason === null) return; // cancelled
            if (!reason.trim()) {
                toast.error('A reason is required to reject a document');
                return;
            }
            body.reason = reason.trim();
        }

        setDocumentActionLoading((prev) => ({ ...prev, [documentId]: action }));
        const endpoint = `${BASE_URL}/admin/driver-document/${documentId}`;
        const verb = action === 'approved' ? 'approve' : 'reject';

        toast.promise(
            fetch(endpoint, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            })
                .then(async (response) => {
                    const json = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(json?.message || `Failed to ${verb} document (${response.status})`);
                    }
                    return json;
                })
                .then(() => {
                    // If this was the last item on a page > 1, step back a page
                    if (documents.length === 1 && page > 1) setPage((p) => p - 1);
                    else fetchDocuments();
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
                success: `Document ${action} successfully!`,
                error: (err) => err.message,
            }
        );
    };

    const overallApproved = driver?.document_status === 'approved' || driver?.verified;
    const overallRejected = driver?.document_status === 'rejected' || driver?.document_status === 'declined';

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
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${overallApproved
                            ? 'bg-green-100 text-green-700'
                            : overallRejected
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                    >
                        {driver?.document_status || (driver?.verified ? 'Approved' : 'Pending/Unverified')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => changeFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer
                                ${documentStatusFilter === s
                                    ? 'bg-black text-white'
                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {s}
                            {documentStatusFilter === s && !isDocumentsLoading && ` (${pagination.total})`}
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
                    {documents.map((doc) => {
                        const label = formatDocName(doc.name);
                        const files = getDocFiles(doc);
                        const loadingAction = documentActionLoading[doc.id];
                        const canApprove = doc.status !== 'approved';
                        const canReject = doc.status !== 'rejected';

                        return (
                            <div
                                key={doc.id}
                                className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col"
                            >
                                {/* Card header */}
                                <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-start gap-2">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide truncate">
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
                                        {canApprove && (
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
                                        )}
                                        {canReject && (
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
                                        )}
                                    </div>
                                </div>

                                {/* Document details */}
                                <div className="px-4 pt-4 grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID Number</span>
                                        <span className="font-semibold text-gray-800 break-all">{doc.id_card_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Uploaded</span>
                                        <span className="font-semibold text-gray-800">{formatDate(doc.createdAt)}</span>
                                    </div>
                                </div>

                                {/* File previews */}
                                <div className="p-4 flex-grow">
                                    {files.length === 0 ? (
                                        <div className="h-32 flex items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400 font-medium">
                                            No file uploaded
                                        </div>
                                    ) : (
                                        <div className={`grid gap-3 ${files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {files.map((f) => (
                                                <FilePreview key={f.label} label={f.label} url={f.url} alt={label} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rejection reason */}
                                {doc.status === 'rejected' && doc.reason && (
                                    <div className="px-4 py-3 border-t border-gray-100 bg-red-50/50 text-xs text-red-600">
                                        <span className="font-bold">Reason: </span>
                                        {doc.reason}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!isDocumentsLoading && !documentsError && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-xs text-gray-500 font-medium">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page <= 1}
                            className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                            disabled={page >= pagination.totalPages}
                            className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDocumentsTab;