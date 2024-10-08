import { axiosInstance } from "@/src/api/axiosClient";
import { Transaction, transactions as localTransactions } from "@/src/assets";
import { Card, FilterBar } from "@/src/features";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function TransactionPage() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axiosInstance.get('/transactions');
                const serverTransactions = response.data.data;
                setAllTransactions(serverTransactions);
                setTotalPages(Math.ceil(serverTransactions.length / ITEMS_PER_PAGE));
                setTransactions(serverTransactions.slice(0, ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching staffs', error);
                setAllTransactions(localTransactions);
                setTotalPages(Math.ceil(localTransactions.length / ITEMS_PER_PAGE));
                setTransactions(localTransactions.slice(0, ITEMS_PER_PAGE));
            }
        };

        fetchTransactions();
    }, []);
    
    useEffect(() => {
        setFilteredTransactions(transactions);
    }, []);

    useEffect(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        setTransactions(allTransactions.slice(startIdx, endIdx));
    }, [currentPage, allTransactions]);

    const filtersConfig = [
        { name: 'receipt', label: 'Receipt', type: 'select' as const, options: ['001', '002'] },
        { name: 'from', label: 'From', type: 'date' as const },
        { name: 'to', label: 'To', type: 'date' as const },
    ];
    
    const handleFilter = (filters: { [key: string]: string }) => {
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const fromDate = filters.from ? new Date(filters.from) : null;
            const toDate = filters.to ? new Date(filters.to) : null;
            
            return (
                (filters.receipt ? transaction.receipt.includes(filters.receipt) : true) &&
                (fromDate ? transactionDate >= fromDate : true) &&
                (toDate ? transactionDate <= toDate : true)
            );
        });
    
        setFilteredTransactions(filtered);
    };

    // IDR CURRENCY FORMAT
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // HANDLE PAGE AND GENERATE PAGE
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full">
                <div className="flex justify-between items-center pt-20 mb-4 gap-6">
                    <div className="text-gray-2">
                        <h2 className="text-xl font-bold">Report</h2>
                        <p className="text-sm">Check your current store report</p>
                    </div>
                </div>

                {/* FILTER CARD */}
                <Card className="mb-4">
                    <div className="flex flex-col w-full justify-between items-start gap-4">
                        <div className="flex flex-col">
                            <h2 className="text-xl text-gray-2 font-semibold">Filter Data Report</h2>
                            <p className="text-sm text-gray-3">Filter your summary for data report</p>
                        </div>

                        <FilterBar 
                            filtersConfig={filtersConfig}
                            onFilter={handleFilter}
                        />
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl text-gray-2 font-semibold">Transaction Summary</h2>
                        <div className="flex flex-row gap-2 text-gray-3 text-sm">
                            <span>period :</span>
                            {/* CHANGE DATE LATER */}
                            <p>09.00, 24 Jul 2024 - 22.00, 26 Jul 2024 </p>
                        </div>
                    </div>

                    <div className="flex flex-row text-gray-2 mb-6">
                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Sales ( items )
                            </p>
                            <h1 className="text-3xl font-bold">
                                21
                            </h1>
                        </div>

                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Taxes ( Rp )
                            </p>
                            <h1 className="text-3xl font-bold">
                                605.500
                            </h1>
                        </div>

                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Completions
                            </p>
                            <h1 className="text-3xl font-bold">
                                7
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-row text-gray-2 mb-4">
                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Services ( Rp )
                            </p>
                            <h1 className="text-3xl font-bold">
                                70.000
                            </h1>
                        </div>

                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Discounts ( Rp )
                            </p>
                            <h1 className="text-3xl font-bold">
                                580.000
                            </h1>
                        </div>

                        <div className="w-1/3 flex flex-col text-center">
                            <p>
                                Total Incomes ( Rp )
                            </p>
                            <h1 className="text-3xl font-bold">
                                6.080.500
                            </h1>
                        </div>
                    </div>

                    {/* Filtered Transactions Table */}
                    <div className="overflow-auto max-h-[23rem] scrollbar-thin border-t border-gray-5">
                        <table className="w-full text-center text-gray-2">
                            <thead className="text-gray-4 sticky top-0 bg-white">
                                <tr>
                                    <th className="p-2">Store Id</th>
                                    <th>Date</th>
                                    <th>Receipt No</th>
                                    <th>Subtotal ( Rp )</th>
                                    <th>Service</th>
                                    <th>Tax ( Rp )</th>
                                    <th>Completion</th>
                                    <th>Discount ( Rp )</th>
                                    <th>Grand Total ( Rp )</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="even:bg-gray-6">
                                        <td className="p-2">{transaction.storeId}</td>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.receipt}</td>
                                        <td>{formatCurrency(transaction.subtotal)}</td>
                                        <td>{formatCurrency(transaction.service)}</td>
                                        <td>{formatCurrency(transaction.tax)}</td>
                                        <td>{transaction.completion}</td>
                                        <td>{formatCurrency(transaction.discount)}</td>
                                        <td>{formatCurrency(transaction.grandTotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}