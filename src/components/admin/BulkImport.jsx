/**
 * BulkImport
 * Bulk import tool for metro network data.
 */
import { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertTriangle, X, Loader } from 'lucide-react';
import './BulkImport.css';

export default function BulkImport() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState([]);
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imported, setImported] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let data;

                if (file.name.endsWith('.json')) {
                    data = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    data = parseCSV(content);
                } else {
                    setErrors([{ type: 'error', message: 'Unsupported file format. Use .csv or .json.' }]);
                    return;
                }
                const validationErrors = validateData(data);
                setErrors(validationErrors);
                setPreview(data);
            } catch (err) {
                setErrors([{ type: 'error', message: `Parse error: ${err.message}` }]);
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (csv) => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i] || ''; });
            return obj;
        });
    };

    const validateData = (data) => {
        const errors = [];
        const ids = new Set();

        if (!Array.isArray(data)) {
            return [{ type: 'error', message: 'Data must be an array of station records' }];
        }

        data.forEach((item, idx) => {
            if (!item.id && !item.station_id) {
                errors.push({ type: 'error', message: `Row ${idx + 1}: Missing station ID`, row: idx });
            }
            if (!item.name && !item.station_name) {
                errors.push({ type: 'warning', message: `Row ${idx + 1}: Missing station name`, row: idx });
            }

            const id = item.id || item.station_id;
            if (id && ids.has(id)) {
                errors.push({ type: 'error', message: `Row ${idx + 1}: Duplicate ID "${id}"`, row: idx });
            }
            ids.add(id);

            if (!item.line && !item.line_id) {
                errors.push({ type: 'warning', message: `Row ${idx + 1}: Missing line assignment`, row: idx });
            }
        });

        return errors;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            parseFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            parseFile(selected);
        }
    };

    const handleImport = () => {
        const hasErrors = errors.some(e => e.type === 'error');
        if (hasErrors) return;

        setImporting(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setImporting(false);
                    setImported(true);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 200);
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setErrors([]);
        setImporting(false);
        setProgress(0);
        setImported(false);
    };

    if (imported) {
        return (
            <div className="import-success animate-scale-in">
                <div className="success-icon">
                    <Check size={48} />
                </div>
                <h3>Import Complete</h3>
                <p className="text-secondary">{preview?.length || 0} stations imported successfully</p>
                <button className="btn btn-primary" onClick={reset}>Import Another File</button>
            </div>
        );
    }

    return (
        <div className="bulk-import animate-fade-in">
            {}
            {!preview && (
                <div
                    className={`upload-zone ${isDragOver ? 'upload-zone-active' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={36} className="upload-icon" />
                    <h3>Upload Metro Data</h3>
                    <p className="text-tertiary">Drag & drop a CSV or JSON file, or click to browse</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>
            )}

            {}
            {preview && !importing && (
                <div className="import-preview">
                    <div className="preview-header">
                        <div className="preview-file-info">
                            <FileText size={18} />
                            <span className="preview-filename">{file?.name}</span>
                            <span className="chip">{preview.length} records</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={reset}>
                            <X size={14} />
                            Clear
                        </button>
                    </div>

                    {}
                    {errors.length > 0 && (
                        <div className="validation-errors">
                            {errors.map((err, idx) => (
                                <div key={idx} className={`validation-item validation-${err.type}`}>
                                    <AlertTriangle size={14} />
                                    <span>{err.message}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {}
                    <div className="preview-table-wrapper">
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    {Object.keys(preview[0] || {}).map(key => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(0, 20).map((row, idx) => {
                                    const hasError = errors.some(e => e.row === idx);
                                    return (
                                        <tr key={idx} className={hasError ? 'row-error' : ''}>
                                            {Object.values(row).map((val, vIdx) => (
                                                <td key={vIdx}>{val || <span className="text-disabled">—</span>}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {preview.length > 20 && (
                            <p className="preview-more text-tertiary">...and {preview.length - 20} more rows</p>
                        )}
                    </div>

                    <div className="import-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleImport}
                            disabled={errors.some(e => e.type === 'error')}
                        >
                            <Check size={16} />
                            Confirm Import
                        </button>
                    </div>
                </div>
            )}

            {}
            {importing && (
                <div className="import-progress animate-fade-in">
                    <Loader size={24} className="spin-icon" />
                    <h3>Importing Data...</h3>
                    <div className="progress-bar-wrapper">
                        <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <span className="text-tertiary">{Math.round(Math.min(progress, 100))}%</span>
                </div>
            )}
        </div>
    );
}
