// src/components/LogoutConfirmationModal.jsx

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react'; // Fragment diperlukan untuk Transition

export default function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    // 1. Bungkus semuanya dengan Transition.Root
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* 2. Tambahkan transisi untuk latar belakang (overlay) */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* 3. Tambahkan transisi untuk panel modal itu sendiri */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-primary p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white">
                  Konfirmasi Logout
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-secondary">
                    Apakah Anda yakin ingin keluar dari sesi ini?
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="py-2 px-4 rounded-md text-secondary hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    onClick={onClose}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    onClick={onConfirm}
                  >
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
