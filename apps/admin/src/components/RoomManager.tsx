import React, { useState } from 'react';
import { Building2, CheckCircle2, XCircle, Clock, MapPin, Users, Plus, ShieldCheck, QrCode, Sparkles, Trash2, CheckCircle, Edit2 } from 'lucide-react';
import { RehearsalRoom, RoomBooking } from '../shared';

interface RoomManagerProps {
  rooms: RehearsalRoom[];
  bookings: RoomBooking[];
  onApproveBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onAddRoom?: (name: string, building: string, capacity: number, equipment: string[]) => void;
  onUpdateRoom?: (id: string, name: string, building: string, capacity: number, equipment: string[]) => void;
  onDeleteRoom?: (roomId: string) => void;
}

export const RoomManager: React.FC<RoomManagerProps> = ({
  rooms,
  bookings,
  onApproveBooking,
  onRejectBooking,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
}) => {
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<RoomBooking | null>(null);
  
  // Create / Edit Room Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RehearsalRoom | null>(null);
  const [roomName, setRoomName] = useState('');
  const [roomBuilding, setRoomBuilding] = useState('Edificio de Difusión Cultural (DAE)');
  const [roomCapacity, setRoomCapacity] = useState(30);
  const [roomEquipmentText, setRoomEquipmentText] = useState('Piano Yamaha, Aislamiento Acústico, Sistema Sound');

  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomName('');
    setRoomBuilding('Edificio de Difusión Cultural (DAE)');
    setRoomCapacity(30);
    setRoomEquipmentText('Piano Yamaha, Aislamiento Acústico, Sistema Sound');
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room: RehearsalRoom) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setRoomBuilding(room.building);
    setRoomCapacity(room.capacity);
    setRoomEquipmentText((room.equipment || []).join(', '));
    setShowRoomModal(true);
  };

  const handleRoomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName) return;

    const equipmentArr = roomEquipmentText.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingRoom && onUpdateRoom) {
      onUpdateRoom(editingRoom.id, roomName, roomBuilding, Number(roomCapacity), equipmentArr);
    } else if (onAddRoom) {
      onAddRoom(roomName, roomBuilding, Number(roomCapacity), equipmentArr);
    }

    setRoomName('');
    setShowRoomModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Building2 style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Préstamos de Espacios Tec
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Gestor de Salones de Ensayo y Permisos Digitales</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Crea, edita, borra salones de ensayo y aprueba reservaciones generando pases digitales con QR para la seguridad del campus.
          </p>
        </div>

        <button className="btn-primary" onClick={handleOpenCreateRoom}>
          <Plus style={{ width: '18px', height: '18px' }} /> + Agregar Salón de Ensamble Tec
        </button>
      </div>

      {/* Catalog of Rooms Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 style={{ color: 'var(--primary)' }} /> Salones de Ensayo Catalogados ({rooms.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
            ⚡ Sincronizado en Tiempo Real
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1rem' }}>{room.name}</h4>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    CAP: {room.capacity} PERS
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: 'var(--accent-rose)' }} />
                  {room.building}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {room.equipment.map((eq, i) => (
                    <span key={i} style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.2)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button
                  onClick={() => handleOpenEditRoom(room)}
                  style={{ flex: 1, background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', color: 'var(--primary)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Edit2 style={{ width: '12px', height: '12px' }} /> Editar
                </button>
                {onDeleteRoom && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar el salón "${room.name}"?`)) onDeleteRoom(room.id);
                    }}
                    style={{ flex: 1, background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', color: 'var(--accent-rose)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Trash2 style={{ width: '12px', height: '12px' }} /> Borrar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Requests List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '16px' }}>
          Solicitudes de Permiso de Ensayo ({bookings.length})
        </h3>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
            <Clock style={{ width: '40px', height: '40px', color: 'var(--primary)', margin: '0 auto 8px auto', display: 'block' }} />
            <p>No hay solicitudes de préstamo pendientes actualmente.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Solicitante / Alumno</th>
                <th>Salón & Propósito</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{booking.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.companyName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{booking.roomName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.purpose}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{booking.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime} hs</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'APPROVED' ? 'badge-emerald' : booking.status === 'REJECTED' ? 'badge-rose' : 'badge-amber'
                    }`}>
                      {booking.status === 'APPROVED' ? '✅ APROBADO' : booking.status === 'REJECTED' ? '❌ RECHAZADO' : '⏳ PENDIENTE'}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-emerald"
                          onClick={() => onApproveBooking(booking.id)}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Aprobar
                        </button>
                        <button
                          className="btn-rose"
                          onClick={() => onRejectBooking(booking.id)}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <XCircle style={{ width: '14px', height: '14px' }} /> Rechazar
                        </button>
                      </div>
                    ) : booking.status === 'APPROVED' ? (
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedBookingForQR(booking)}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <QrCode style={{ width: '14px', height: '14px', color: 'var(--primary)' }} /> Ver Pase QR Caseta
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin acción</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Create or Edit Room */}
      {showRoomModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleRoomFormSubmit} className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 style={{ color: 'var(--primary)' }} /> {editingRoom ? 'Editar Salón de Ensamble Tec' : 'Agregar Salón de Ensamble Tec'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {editingRoom ? 'Modifica el nombre, capacidad o equipamiento del salón.' : 'Registra un nuevo espacio o salón para préstamo en el sistema.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre del Salón / Espacio</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ej: Salón de Danza & Expresión B-202"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Edificio / Ubicación Tec</label>
                <input
                  type="text"
                  required
                  value={roomBuilding}
                  onChange={(e) => setRoomBuilding(e.target.value)}
                  placeholder="Ej: Edificio de Difusión Cultural (DAE)"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Capacidad (Personas)</label>
                <input
                  type="number"
                  required
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Equipamiento (Separado por comas)</label>
                <input
                  type="text"
                  value={roomEquipmentText}
                  onChange={(e) => setRoomEquipmentText(e.target.value)}
                  placeholder="Ej: Piano Yamaha, Batería, Sistema PA, Espejos"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRoomModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> {editingRoom ? 'Guardar Cambios' : 'Crear Salón'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* QR Code Security Modal for Approved Bookings */}
      {selectedBookingForQR && (
        <div className="modal-backdrop">
          <div className="glass-panel" style={{ width: '400px', padding: '28px', textAlign: 'center', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-emerald)' }}>
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Pase Digital Tec Caseta</h3>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Código Oficial de Permiso para Caseta de Seguridad Tec y Guardia de Edificio
            </p>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedBookingForQR.qrPermissionCode || 'PERMISO-TEC')}`}
                alt="QR Permiso"
                style={{ width: '180px', height: '180px' }}
              />
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedBookingForQR.qrPermissionCode}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedBookingForQR.studentName} | {selectedBookingForQR.roomName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700, marginTop: '2px' }}>
                📅 {selectedBookingForQR.date} ({selectedBookingForQR.startTime} - {selectedBookingForQR.endTime} hs)
              </div>
            </div>

            <button className="btn-primary" onClick={() => setSelectedBookingForQR(null)} style={{ width: '100%' }}>
              Cerrar Pase Digital
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
