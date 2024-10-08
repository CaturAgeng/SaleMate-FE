import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/src/api/axiosClient";
import { Button, CancelButton, Card, DeleteButton, Modal } from "@/src/features";
import { Payment } from "@/src/assets";
import Loader from "../../base/Loader";

const ITEMS_PER_PAGE = 10;

export default function PaymentPage() {
    const [allPayments, setAllPayments] = useState<Payment[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [SelectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        payment_id: '',
        payment_type: '',
        payment_name: '',
    });
    const [errors, setErrors] = useState({
        payment_type: '',
        payment_name: '',
    });
    // const [showPassword, setShowPassword] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true)
                console.log("Loading started");

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const response = await axiosInstance.get('/payments'); 
                const staffData = response.data;

                setAllPayments(staffData);
                setTotalPages(Math.ceil(staffData.length / ITEMS_PER_PAGE));
                setPayments(staffData.slice(0, ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching payments', error);
            } finally {
                setLoading(false);
                console.log("Loading finished");
            }
        };

        fetchPayments();
    }, []);

    useEffect(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        setPayments(allPayments.slice(startIdx, endIdx));
    }, [currentPage, allPayments]);

    // HANDLE POP UP ADD DATA
    const handleModalOpen = (type: string, payment?: Payment) => {
        if (type === 'add') {
            setIsAddModalOpen(true);
        } else if (type === 'edit' && payment) {
            setSelectedPayment(payment);
            setFormData({
                payment_id: payment.payment_id,
                payment_type: payment.payment_type,
                payment_name: payment.payment_name
            });
            setIsEditModalOpen(true);
        } else if (type === 'delete' && payment) {
            setSelectedPayment(payment);
            setIsDeleteModalOpen(true);
        }
    };
    
    const handleModalClose = () => {
        setIsSecondModalOpen(false);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedPayment(null);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(({
            ...formData,
            [name]: value
        }));
        console.log(formData);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log("Type selected in handler:", value, formData);
    }

    const refreshPayments = async () => {
        try {
            const response = await axiosInstance.get('/payments');
            const staffData = response.data;
            setAllPayments(staffData);
            setPayments(staffData.slice(0, ITEMS_PER_PAGE));
        } catch (error) {
            console.error('Error refreshing payments', error);
        }
    };
    
    const handleConfirmAdd = async () => {
        if (!validateForm()) return;

        try {
            const { payment_id, ...dataToSend } = formData;
            console.log('Sending data:', dataToSend);
            await axiosInstance.post(`/payments`, dataToSend);
            await refreshPayments();
            handleModalClose();
            setIsAddModalOpen(false);
            setIsSecondModalOpen(true);
        } catch (error) {
            console.error('Error adding payment', error);
        }
    };

    const handleConfirmEdit = async () => {
        try {
            const { payment_id, ...dataToSend } = formData;
            if (SelectedPayment) {
                await axiosInstance.put(`/payments/${SelectedPayment.payment_id}`, dataToSend);
                await refreshPayments();
                handleModalClose();
            }
        } catch (error) {
            console.error('Error editing payment', error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (SelectedPayment) {
                await axiosInstance.delete(`/payments/${SelectedPayment.payment_id}`);
                await refreshPayments();
                handleModalClose();
            }
        } catch (error) {
            console.error('Error deleting payment', error);
        }
    };
    
    // HANDLE PAGE AND GENERATE PAGE
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            payment_type: '',
            payment_name: '',
        };
    
        if (!formData.payment_type) {
            newErrors.payment_type = 'Payment type is required';
            isValid = false;
        }
        if (!formData.payment_name) {
            newErrors.payment_name = 'Payment Name is required';
            isValid = false;
        }
        // if (!formData.tax_status) {
        //     newErrors.tax_status = 'Status is required';
        //     isValid = false;
        // }
    
        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full">

                <div className="flex justify-between items-center pt-20 mb-4 gap-6">
                    <div className="text-gray-2">
                        <h2 className="text-xl font-bold">Payment</h2>
                        <p className="text-sm">Check your store payment details, you can add, edit and delete</p>
                    </div>
                    <Button className="bg-orange-2 h-full w-48 text-white rounded" onClick={() => handleModalOpen('add')}>+ Add Payment</Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-gray-2 font-semibold">Payment Data</h2>
                        
                        {/* PAGE */}
                        <div className="flex items-center gap-2">
                            <svg 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`cursor-pointer stroke-gray-3 ${currentPage === 1 ? 'opacity-10 cursor-not-allowed' : ''}`}
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`w-6 h-6 flex items-center justify-center rounded ${number === currentPage ? 'bg-orange-2 text-white' : 'bg-gray-6 hover:bg-gray-5'}`}
                                >
                                    {number}
                                </button>
                            ))}
                            <svg 
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`cursor-pointer stroke-gray-3 ${currentPage === totalPages ? 'opacity-10 cursor-not-allowed' : ''}`}
                                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        
                    </div>

                    {loading ? (
                        <Loader />
                    ) : (

                    <div>
                        <table className="min-w-full table-fixed text-center">
                            <thead className=" text-gray-4">
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th className="w-10">Action</th>
                                </tr>
                            </thead>
                            <tbody className=" text-gray-1">
                                {payments.map((payment) => (
                                    <tr key={payment.payment_id} className="even:bg-gray-6">
                                        <td className="">{payment.payment_type}</td>
                                        <td className="">{payment.payment_name}</td>
                                        <td className="py-4 px-4 flex justify-center items-center gap-1">
                                            <button className="w-10 bg-gray-200 p-1 rounded hover:bg-gray-300 flex justify-center" title="edit" onClick={() => handleModalOpen('edit', payment)}>
                                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.3491 3.55222L14.6846 2.21589C14.963 1.93748 15.3406 1.78107 15.7344 1.78107C16.1281 1.78107 16.5057 1.93748 16.7841 2.21589C17.0625 2.4943 17.2189 2.87191 17.2189 3.26564C17.2189 3.65937 17.0625 4.03698 16.7841 4.31539L8.37742 12.7221C7.95888 13.1404 7.44275 13.4478 6.87563 13.6167L4.75 14.25L5.38333 12.1244C5.55218 11.5573 5.85963 11.0411 6.27792 10.6226L13.3491 3.55222ZM13.3491 3.55222L15.4375 5.64064M14.25 11.0833V14.8438C14.25 15.3162 14.0623 15.7692 13.7283 16.1033C13.3942 16.4373 12.9412 16.625 12.4688 16.625H4.15625C3.68383 16.625 3.23077 16.4373 2.89672 16.1033C2.56267 15.7692 2.375 15.3162 2.375 14.8438V6.53126C2.375 6.05885 2.56267 5.60578 2.89672 5.27173C3.23077 4.93768 3.68383 4.75001 4.15625 4.75001H7.91667" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button className="w-10 bg-red-200 p-1 rounded hover:bg-red-300 flex justify-center" title="delete" onClick={() => handleModalOpen('delete', payment)}>
                                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.6692 7.12499L11.3953 14.25M7.60475 14.25L7.33083 7.12499M15.2222 4.58374C15.4929 4.6249 15.7621 4.66844 16.0313 4.71515M15.2222 4.58374L14.3767 15.5744C14.3422 16.0219 14.14 16.4399 13.8106 16.7447C13.4813 17.0496 13.049 17.2189 12.6002 17.2187H6.39983C5.95103 17.2189 5.51873 17.0496 5.18936 16.7447C4.85999 16.4399 4.65784 16.0219 4.62333 15.5744L3.77783 4.58374M15.2222 4.58374C14.3085 4.4456 13.3901 4.34077 12.4688 4.26944M3.77783 4.58374C3.50708 4.62411 3.23792 4.66765 2.96875 4.71436M3.77783 4.58374C4.69152 4.4456 5.60994 4.34077 6.53125 4.26944M12.4688 4.26944V3.54428C12.4688 2.61011 11.7483 1.83111 10.8142 1.80182C9.93828 1.77382 9.06172 1.77382 8.18583 1.80182C7.25167 1.83111 6.53125 2.6109 6.53125 3.54428V4.26944M12.4688 4.26944C10.4925 4.11671 8.50747 4.11671 6.53125 4.26944" stroke="#F04B4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    )}

                </Card>
            </div>

            {/* FILL STAFF DATA POP UP */}
            <Modal isOpen={isAddModalOpen} onClose={handleModalClose} onConfirm={handleConfirmAdd}>
                <div className="w-full flex flex-col items-center pb-10">
                    <h2 className="text-2xl font-bold text-orange-2">Add Driver Partner</h2>
                    <span className="text-sm text-gray-3">Input all necesary data</span>
                </div>
                <form className="w-full text-center mb-6">
                    {/* {errors.payment_type && <p className="text-red-600 text-sm">{errors.payment_type}</p>} */}
                    <label>Type</label>
                    <select
                        name="payment_type"
                        className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                        value={formData.payment_type}                    
                        onChange={handleTypeChange}
                        >
                        <option value="">Select Type</option>
                        <option value="Bank">Bank</option>
                        <option value="Cash">Cash</option>
                        <option value="EPayment">EPayment</option>
                    </select>
                    {/* <input
                        type="text"
                        name="payment_type"
                        className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                        placeholder="e.g Bank, Cash, EPayment"
                        value={formData.payment_type}
                        onChange={handleInputChange}
                    /> */}
                    <label>Name</label>
                    {errors.payment_name && <p className="text-red-600 text-sm">{errors.payment_name}</p>}
                    <input
                        type="email"
                        name="payment_name"
                        className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                        placeholder="e.g BCA, BRI, BNI"
                        value={formData.payment_name}
                        onChange={handleInputChange}
                    />
                </form>
                <div className="flex justify-between w-full mt-4 gap-2">
                    <CancelButton
                        onClick={handleModalClose}
                    >
                        Cancel
                    </CancelButton>
                    <Button
                        onClick={handleConfirmAdd}
                    >
                        Ok
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={isSecondModalOpen} onClose={handleModalClose} onConfirm={handleModalClose}>
                <div className="w-full flex flex-col items-center pb-10">
                    <div className="text-green-2 flex row gap-2 justify-center items-center">
                        <svg width="24" height="24" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M10.3333 15.5417L13.4583 18.6667L18.6667 11.375M27 14.5C27 16.1415 26.6767 17.767 26.0485 19.2835C25.4203 20.8001 24.4996 22.1781 23.3388 23.3388C22.1781 24.4996 20.8001 25.4203 19.2835 26.0485C17.767 26.6767 16.1415 27 14.5 27C12.8585 27 11.233 26.6767 9.71646 26.0485C8.19989 25.4203 6.8219 24.4996 5.66116 23.3388C4.50043 22.1781 3.57969 20.8001 2.95151 19.2835C2.32332 17.767 2 16.1415 2 14.5C2 11.1848 3.31696 8.00537 5.66116 5.66117C8.00537 3.31696 11.1848 2 14.5 2C17.8152 2 20.9946 3.31696 23.3388 5.66117C25.683 8.00537 27 11.1848 27 14.5Z" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"/>
                        </svg>
                        <h2 className="text-2xl font-bold">Payment Added</h2>
                    </div>
                    <span className="text-sm text-gray-3">You can update or delete this data later</span>
                </div>
                <div className="text-gray-1 w-full flex flex-col mb-6 gap-6">
                    <div className="flex flex-row gap-4 justify-start">
                        <h2 className="w-1/3 font-bold text-gray-3">Payment Type</h2>
                        <span>:</span>
                        <p>{formData.payment_type}</p> 
                    </div>

                    <div className="flex flex-row gap-4 justify-start">
                        <h2 className="w-1/3 font-bold text-gray-3">Payment Name</h2>
                        <span>:</span>
                        <p>{formData.payment_name}</p> 
                    </div>
                </div>
                <Button
                    onClick={handleModalClose}
                >
                    Ok
                </Button>
            </Modal>

            {/* EDIT */}
            <Modal isOpen={isEditModalOpen} onClose={handleModalClose} onConfirm={handleModalClose}>
                    <div className="w-full flex flex-col items-center pb-10">
                        <h2 className="text-2xl font-bold text-orange-2">Edit Staff</h2>
                        <span className="text-sm text-gray-3">Edit necesary data</span>
                    </div>
                    <form className="w-full text-center mb-6">
                        <label>Type</label>
                        <select
                            name="payment_type"
                            className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                            value={formData.payment_type}                    
                            onChange={handleTypeChange}
                            >
                            <option value="">Select Type</option>
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                            <option value="EPayment">EPayment</option>
                        </select>
                        {/* <input
                            type="text"
                            name="type"
                            className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                            placeholder="Enter driver partner type"
                            value={formData.payment_type}
                            onChange={handleInputChange}
                        /> */}
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            className="border border-gray-300 p-2 mb-4 drop-shadow-md w-full rounded-[10px]"
                            placeholder="Enter driver partner name"
                            value={formData.payment_name}
                            onChange={handleInputChange}
                        />
                    </form>
                    <div className="flex justify-between w-full mt-4 gap-2">
                            <CancelButton 
                                onClick={handleModalClose}
                            >
                                Cancel
                            </CancelButton>
                            <Button
                                onClick={handleConfirmEdit}
                            >
                                Ok
                            </Button>
                        </div>
            </Modal>
            
            {/* DELETE */}
            <Modal isOpen={isDeleteModalOpen} onClose={handleModalClose} onConfirm={handleModalClose}>
                <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-orange-2">Confirm Delete</h2>
                        <span className="text-gray-2">Are you sure you want to delete</span>
                </div>
                    <h2 className="p-6 text-2xl text-bold text-gray-1">{SelectedPayment?.payment_name}</h2>
                <div className="flex justify-between w-full mt-4 gap-2">
                    <CancelButton 
                        onClick={handleModalClose}
                    >
                        Cancel
                    </CancelButton>
                    <DeleteButton
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </DeleteButton>
                </div>
            </Modal>
        </div>
    );
}

