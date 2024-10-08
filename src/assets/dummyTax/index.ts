export interface Tax {
    tax_id: number,
    tax_type: string,
    tax_name: string,
    tax_value: number,
    tax_status: boolean,
    created_at: string,
    updated_at: string,
    isDelete?: string,
}

export enum TaxType {
    SERVICE = 'SERVICE',
    FEE = 'FEE',
}

export interface Promo {
    promo_id: number;
    promo_name: string;
    promo_type: PromoType;
    promo_value: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string; 
}

export enum PromoType {
    DISCOUNT = 'DISCOUNT',
    SALES = 'SALES',
}

// export const dummyTax: Tax[] = [
//     {
//         tax_id: 'BDG01',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: true,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG02',
//         tax_type: 'service',
//         tax_name: 'Birthday',
//         tax_value: 15,
//         tax_status: true,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG03',
//         tax_type: 'fee',
//         tax_name: 'Dating',
//         tax_value: 20,
//         tax_status: true,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG04',
//         tax_type: 'service',
//         tax_name: 'Motorised vehicle',
//         tax_value: 8,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG05',
//         tax_type: 'service',
//         tax_name: 'Dinner',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG06',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG07',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG08',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG09',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG010',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG011',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
//     {
//         tax_id: 'BDG012',
//         tax_type: 'service',
//         tax_name: 'Entertainment',
//         tax_value: 10,
//         tax_status: false,
//         created_at: '2024-01-08',
//         updated_at: '2024-01-08',
//         isDelete: false,
//     },
// ]

// export const dummyPromos: Promo[] = [
//     {
//         promo_id: 'BDG01',
//         promo_name: 'Saya',
//         promo_type: "discount",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG02',
//         promo_name: 'Saya',
//         promo_type: "discount",
//         promo_value: 10,
//         start_date: "27/07/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG03',
//         promo_name: 'Saya',
//         promo_type: "discount",
//         promo_value: 30,
//         start_date: "06/06/2024",
//         end_date: "-",
//     },
//     {
//         promo_id: 'BDG04',
//         promo_name: 'Saya',
//         promo_type: "discount",
//         promo_value: 10,
//         start_date: "20/07/2024",
//         end_date: "27/07/2024",
//     },
//     {
//         promo_id: 'BDG05',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 30,
//         start_date: "15/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG06',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 50,
//         start_date: "15/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG07',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 10,
//         start_date: "30/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG08',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG09',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG010',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG011',
//         promo_name: 'Saya',
//         promo_type: "discount",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     },
//     {
//         promo_id: 'BDG012',
//         promo_name: 'Saya',
//         promo_type: "sales",
//         promo_value: 10,
//         start_date: "08/08/2024",
//         end_date: "18/08/2024",
//     }
// ]