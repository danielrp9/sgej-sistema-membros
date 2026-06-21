import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert', // 'alert', 'confirm', 'prompt'
    title: '',
    message: '',
    promptValue: '',
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = (message, title = 'Notificação') => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: 'alert',
        title,
        message,
        promptValue: '',
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
      });
    });
  };

  const showConfirm = (message, title = 'Confirmar Ação') => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        promptValue: '',
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  const showPrompt = (message, defaultValue = '', title = 'Entrada Necessária') => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        promptValue: defaultValue,
        onConfirm: (val) => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(val);
        },
        onCancel: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(null);
        },
      });
    });
  };

  const handleConfirm = (val) => {
    if (modal.onConfirm) modal.onConfirm(val);
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
  };

  return (
    <ModalContext.Provider value={{ alert: showAlert, confirm: showConfirm, prompt: showPrompt }}>
      {children}
      {modal.isOpen && (
        <ModalComponent modal={modal} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser utilizado dentro de um ModalProvider');
  }
  return context;
}

function ModalComponent({ modal, onConfirm, onCancel }) {
  const [inputValue, setInputValue] = useState(modal.promptValue);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Banner do Modal */}
        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-50 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
            <span className="font-black text-xs">NS</span>
          </div>
          <div>
            <h4 className="text-[9px] font-black text-brand-muted uppercase tracking-widest leading-none">NextStep SGEJ</h4>
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-tight mt-1">{modal.title}</h3>
          </div>
        </div>

        {/* Mensagem / Input */}
        <div className="p-8 space-y-4">
          <p className="text-xs font-bold text-brand-dark/80 leading-relaxed whitespace-pre-wrap">
            {modal.message}
          </p>

          {modal.type === 'prompt' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua resposta..."
              className="w-full bg-gray-50 border-none rounded-xl p-3.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/5 transition-all font-bold mt-2"
              autoFocus
            />
          )}
        </div>

        {/* Botões */}
        <div className="px-8 pb-8 flex gap-3">
          {(modal.type === 'confirm' || modal.type === 'prompt') && (
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-dark hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={() => onConfirm(modal.type === 'prompt' ? inputValue : true)}
            className="flex-1 bg-brand-dark hover:bg-black text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
