import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, User, Shield, RefreshCw } from 'lucide-react';
import { StudentProfile } from '../shared';
import { fetchMessagesInNeon, sendMessageInNeon, fetchUsersForChatInNeon, InternalMessage, ChatContact } from '../api';

interface StudentChatModalProps {
  student: StudentProfile;
  onClose: () => void;
}

export const StudentChatModal: React.FC<StudentChatModalProps> = ({ student, onClose }) => {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chatUsers, allMsgs] = await Promise.all([
        fetchUsersForChatInNeon(),
        fetchMessagesInNeon(student.matricula || student.id),
      ]);
      // Filter out self from contacts
      const filteredContacts = chatUsers.filter((c) => c.email !== student.email && c.id !== student.id);
      setContacts(filteredContacts);
      setMessages(allMsgs);

      // Default to admin or first channel
      if (!selectedContact && filteredContacts.length > 0) {
        setSelectedContact(filteredContacts[0]);
      }
    } catch (e) {
      console.error('Error loading chat:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedContact) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    const tempMsg: InternalMessage = {
      id: `tmp-${Date.now()}`,
      senderId: student.matricula || student.id,
      senderName: student.name,
      senderRole: 'STUDENT',
      receiverId: selectedContact.id,
      receiverName: selectedContact.name,
      companyName: student.companyName,
      content: textToSend,
      createdAt: 'Ahora',
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      await sendMessageInNeon({
        senderId: student.matricula || student.id,
        senderName: student.name,
        senderRole: 'STUDENT',
        receiverId: selectedContact.id,
        receiverName: selectedContact.name,
        companyName: student.companyName,
        content: textToSend,
      });
      await loadData();
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setSending(false);
    }
  };

  // Filter messages for current selected contact or channel
  const conversationMessages = messages.filter((m) => {
    if (!selectedContact) return false;
    if (selectedContact.id === 'all-channel') {
      return m.receiverId === 'ALL' || m.receiverId === 'all-channel';
    }
    return (
      (m.senderId === student.matricula || m.senderId === student.id) && m.receiverId === selectedContact.id
    ) || (
      m.senderId === selectedContact.id || (m.senderId === selectedContact.email)
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="mitec-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '540px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, #0033a0 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', margin: 0 }}>
                Chat Interno & Inbox
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>
                Mensajería con Alumnos, Maestros y Dirección
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={loadData}
              style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: '4px' }}
              title="Actualizar mensajes"
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        {/* Contact Selector Strip */}
        <div
          style={{
            padding: '8px 12px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {contacts.map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            return (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #0033a0' : '1px solid #cbd5e1',
                  background: isSelected ? '#0033a0' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {contact.role === 'ADMIN' ? (
                  <Shield style={{ width: '12px', height: '12px', color: isSelected ? '#fff' : '#0033a0' }} />
                ) : (
                  <User style={{ width: '12px', height: '12px', color: isSelected ? '#fff' : '#64748b' }} />
                )}
                <span>{contact.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Contact Banner */}
        {selectedContact && (
          <div
            style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.78rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Chat con: <strong>{selectedContact.name}</strong>
            </span>
            <span style={{ fontSize: '0.7rem', color: '#0033a0', fontWeight: 700 }}>
              {selectedContact.role === 'ADMIN' ? 'DIRECTOR / ADMIN' : 'INTEGRANTE'}
            </span>
          </div>
        )}

        {/* Message History Container */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: '#ffffff',
          }}
        >
          {loading && messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: '20px' }}>
              Cargando mensajes...
            </div>
          ) : conversationMessages.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.85rem',
                margin: 'auto 0',
                padding: '20px',
              }}
            >
              💬 No hay mensajes en este chat aún. Escribe el primer mensaje a <strong>{selectedContact?.name}</strong>.
            </div>
          ) : (
            conversationMessages.map((msg, idx) => {
              const isMine = msg.senderId === student.matricula || msg.senderId === student.id || msg.senderName === student.name;
              return (
                <div
                  key={msg.id || idx}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px', padding: '0 4px' }}>
                    {isMine ? 'Tú' : msg.senderName} • {msg.createdAt}
                  </span>
                  <div
                    style={{
                      background: isMine ? '#0033a0' : '#f1f5f9',
                      color: isMine ? '#ffffff' : '#0f172a',
                      padding: '10px 14px',
                      borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.85rem',
                      lineHeight: '1.4',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={selectedContact ? `Escribir a ${selectedContact.name.split(' ')[0]}...` : 'Escribe un mensaje...'}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: inputMessage.trim() ? '#0033a0' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputMessage.trim() ? 'pointer' : 'default',
              transition: 'background 0.2s',
            }}
          >
            <Send style={{ width: '18px', height: '18px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
