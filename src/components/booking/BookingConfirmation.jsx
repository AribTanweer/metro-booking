/**
 * BookingConfirmation
 * UI component for the Metro Booking application.
 */
import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RotateCcw, ArrowLeft, CheckCircle, Clock, MapPin, Repeat, IndianRupee } from 'lucide-react';
import './BookingConfirmation.css';

export default function BookingConfirmation({ booking, onNewBooking, onBack }) {
    const ticketRef = useRef(null);

    const handleDownload = useCallback(() => {
        const ticket = ticketRef.current;
        if (!ticket) return;
        const svg = ticket.querySelector('svg');
        if (svg) {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = '#1C1B1F';
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MetroBook Ticket', 200, 30);

            ctx.font = '14px Inter, sans-serif';
            ctx.fillText(`${booking.source.name} → ${booking.destination.name}`, 200, 60);
            ctx.fillText(`Ref: ${booking.ref}`, 200, 85);
            ctx.fillText(`Fare: ₹${booking.route.fare}`, 200, 110);
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 100, 130, 200, 200);

                ctx.font = '11px Inter, sans-serif';
                ctx.fillStyle = '#79747E';
                ctx.fillText(new Date(booking.timestamp).toLocaleString(), 200, 360);

                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `metrobook-ticket-${booking.ref}.png`;
                link.href = url;
                link.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }
    }, [booking]);

    return (
        <div className="booking-confirmation">
            <button className="btn btn-ghost btn-sm back-btn" onClick={onBack}>
                <ArrowLeft size={14} />
                Back to routes
            </button>

            <div className="confirmation-card card card-elevated animate-scale-in" ref={ticketRef}>
                <div className="confirmation-success">
                    <div className="success-icon animate-scale-in">
                        <CheckCircle size={40} />
                    </div>
                    <h2>Booking Confirmed!</h2>
                    <p className="text-secondary">Your metro ticket is ready</p>
                </div>

                <div className="confirmation-ref">
                    <span className="ref-label">Booking Reference</span>
                    <span className="ref-number">{booking.ref}</span>
                </div>

                <div className="divider" />

                <div className="confirmation-details">
                    <div className="detail-row">
                        <MapPin size={16} className="detail-icon" />
                        <div>
                            <span className="detail-label">From</span>
                            <span className="detail-value">{booking.source.name}</span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <MapPin size={16} className="detail-icon" />
                        <div>
                            <span className="detail-label">To</span>
                            <span className="detail-value">{booking.destination.name}</span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <Clock size={16} className="detail-icon" />
                        <div>
                            <span className="detail-label">Est. Time</span>
                            <span className="detail-value">{booking.route.totalDuration} min</span>
                        </div>
                    </div>
                    {booking.route.transfers > 0 && (
                        <div className="detail-row">
                            <Repeat size={16} className="detail-icon" />
                            <div>
                                <span className="detail-label">Transfers</span>
                                <span className="detail-value">{booking.route.transfers}</span>
                            </div>
                        </div>
                    )}
                    <div className="detail-row detail-row-fare">
                        <IndianRupee size={16} className="detail-icon" />
                        <div>
                            <span className="detail-label">Fare</span>
                            <span className="detail-value fare-value">₹{booking.route.fare}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                <div className="qr-section">
                    <div className="qr-wrapper animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <QRCodeSVG
                            value={booking.qrData}
                            size={180}
                            level="M"
                            includeMargin
                            bgColor="#FFFFFF"
                            fgColor="#1C1B1F"
                        />
                    </div>
                    <p className="qr-hint text-tertiary">Scan at entry gate</p>
                </div>
            </div>

            <div className="confirmation-actions animate-fade-in" style={{ animationDelay: '400ms' }}>
                <button className="btn btn-outline" onClick={handleDownload}>
                    <Download size={16} />
                    Download Ticket
                </button>
                <button className="btn btn-primary" onClick={onNewBooking}>
                    <RotateCcw size={16} />
                    New Booking
                </button>
            </div>
        </div>
    );
}
