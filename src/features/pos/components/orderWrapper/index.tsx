import React, { useContext, useState, useEffect } from 'react';
import { Cart, OrderHome, OrderMenu, PosHeader } from '@/src/features/pos';
import { InputCustomerModal } from '../inputCustomerModal';
import { TransactionContext, useTransactionContext } from '@/src/context';

export function OrderWrapper() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { customerName, isCustomerSaved, setCustomerSaved } = useTransactionContext()

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isCustomerSaved) {
            handleCloseModal(); // Close the modal when the customer is saved
        }
    }, [isCustomerSaved, setCustomerSaved]);

    console.log(isCustomerSaved)

    return (
        <div className="bg-gray-100 h-screen overflow-hidden">
            <div className="flex h-full">
                <div className="w-2/3 flex flex-col space-y-4" id="order-home">
                    <PosHeader cashierName="Nata de Coco" date="17:00 29/07/24" cashierStatus="Open" />
                    <div className={isCustomerSaved ? 'hidden' : 'block'}>
                        <OrderHome />
                    </div>
                    <div className={isCustomerSaved ? 'block' : 'hidden'}>
                        <OrderMenu />
                    </div>
                </div>

                <div className="w-1/3">
                    <Cart />
                </div>
            </div>

            {isModalOpen && (
                <InputCustomerModal
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
