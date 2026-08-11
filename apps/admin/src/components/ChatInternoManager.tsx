import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Search, RefreshCw, ShieldCheck, Mail, Filter } from 'lucide-react';
import { StudentProfile } from '../shared';
import { fetchAllAdminMessages, sendAdminMessage } from '../api';

interface ChatInternoManagerProps {
  students: StudentProfile[];
  adminUser?: { name: string; email: string; role: string } | null;
}

interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  companyName?: string;
  content: string;
  createdAt: string;
}

export const ChatInternoManager: React.FC<ChatInternoManagerProps> = ({ students, adminUser }) => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAdminMessages();
      setMessages(data);
    } catch (e) {
      console.error('Error fetching admin messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
  }, []);

  // Build conversations list based on active students + admin channels
  const chatTargets = [
    { id: 'ALL', name: '📢 Canal General (Todos los Alumnos)', email: 'todos@tec.mx', role: 'CANAL' },
    ...students.map((s) => ({
      id: s.matricula || s.id,
      name: s.name,
      email: s.email,
      role: 'STUDENT',
    })),
  ];

  const filteredTargets = chatTargets.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Default selection
  useEffect(() => {
    if (!selectedRecipient && filteredTargets.length > 0) {
      setSelectedRecipient(filteredTargets[0]);
    }
  }, [filteredTargets]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedRecipient) return;

    const textToSend = replyText.trim();
    setReplyText('');
    setSending(true);

    const tempMsg: AdminMessage = {
      id: `tmp-${Date.now()}`,
      senderId: 'admin-1',
      senderName: adminUser?.name || 'Prof. Alejandro Gallegos',
      senderRole: 'ADMIN',
      receiverId: selectedRecipient.id,
      receiverName: selectedRecipient.name,
      content: textToSend,
      createdAt: 'Ahora',
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      await sendAdminMessage({
        senderId: 'admin-1',
        senderName: adminUser?.name || 'Prof. Alejandro Gallegos',
        receiverId: selectedRecipient.id,
        receiverName: selectedRecipient.name,
        content: textToSend,
      });
      await loadMessages();
    } catch (e) {
      console.error('Error sending admin reply:', e);
    } finally {
      setSending(false);
    }
  };

  // Filter messages for current selected target
  const currentConversation = messages.filter((m) => {
    if (!selectedRecipient) return false;
    if (selectedRecipient.id === 'ALL') {
      return m.receiverId === 'ALL' || m.receiverId === 'all-channel';
    }
    return (
      (m.senderId === selectedRecipient.id || m.senderId === selectedRecipient.email || m.senderName === selectedRecipient.name) ||
      (m.receiverId === selectedRecipient.id || m.receiverName === selectedRecipient.name)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Module Banner Header */}
      <div
        className="mitec-card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <MessageSquare style={{ width: '26px', height: '26px', color: '#38bdf8' }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Inbox & Chat Interno de la Compañía
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Supervisión y respuesta a mensajes directos entre Alumnos, Profesores y Dirección.
          </p>
        </div>

        <button
          onClick={loadMessages}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} /> Actualizar Chat
        </button>
      </div>

      {/* Main Grid: Left contacts list, Right chat box */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '520px' }}>
        {/* Left Panel: Contact Search & List */}
        <div className="mitec-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alumno o correo..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredTargets.map((target) => {
              const isSelected = selectedRecipient?.id === target.id;
              const targetMsgs = messages.filter(
                (m) => m.senderId === target.id || m.receiverId === target.id || m.senderName === target.name
              );
              const lastMsg = targetMsgs[targetMsgs.length - 1];

              return (
                <button
                  key={target.id}
                  onClick={() => setSelectedRecipient(target)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? '#e0f2fe' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#0033a0' : '#0f172a' }}>
                      {target.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {lastMsg?.createdAt || ''}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lastMsg ? lastMsg.content : 'Sin mensajes aún'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Transcript & Reply Console */}
        <div className="mitec-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedRecipient ? (
            <>
              {/* Header Bar */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: 0 }}>
                    {selectedRecipient.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{selectedRecipient.email}</span>
                </div>
                <div style={{ fontSize: '0.75rem', background: '#0033a0', color: '#ffffff', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>
                  ADMINISTRACIÓN
                </div>
              </div>

              {/* Chat Messages Log */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafafa' }}>
                {loading && currentConversation.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', margin: 'auto' }}>
                    Cargando historial de chat...
                  </div>
                ) : currentConversation.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', margin: 'auto', padding: '40px' }}>
                    💬 No hay mensajes en este chat. Escribe un mensaje directo a <strong>{selectedRecipient.name}</strong>.
                  </div>
                ) : (
                  currentConversation.map((msg, i) => {
                    const isAdminMsg = msg.senderRole === 'ADMIN' || msg.senderId === 'admin-1';
                    return (
                      <div
                        key={msg.id || i}
                        style={{
                          alignSelf: isAdminMsg ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdminMsg ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', padding: '0 4px' }}>
                          {isAdminMsg ? 'Tú (Admin)' : msg.senderName} • {msg.createdAt}
                        </span>
                        <div
                          style={{
                            background: isAdminMsg ? '#0033a0' : '#ffffff',
                            color: isAdminMsg ? '#ffffff' : '#0f172a',
                            border: isAdminMsg ? 'none' : '1px solid #e2e8f0',
                            padding: '12px 16px',
                            borderRadius: isAdminMsg ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            fontSize: '0.88rem',
                            lineHeight: '1.4',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Console Input */}
              <form
                onSubmit={handleSendReply}
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Responder a ${selectedRecipient.name.split(' ')[0]} como Administrador...`}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '999px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '999px',
                    background: replyText.trim() ? '#0033a0' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: replyText.trim() ? 'pointer' : 'default',
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} /> Enviar
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', color: '#94a3b8', textAlign: 'center' }}>
              Selecciona una conversación para ver los mensajes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
