import React, { useEffect, useState } from "react";
import { Input } from "../../../base";
import { CategoryProductButton } from "../categoryProductButton";
import { ProductCard } from "../productCard";
import { axiosInstance } from "@/src/api/axiosClient";
import { useTransactionContext } from "@/src/context";
import { ProductProps } from "./type";
import { AddProductModal } from "../addProductModal";

const dummyProducts = Array.from({ length: 100 }, (v, i) => ({
    product_id: i + 1,
    product_name: `Product ${i + 1}`,
    product_price: Math.floor(Math.random() * 1000) + 50, // Random price between 50 and 1050
    product_image: "/img/default-product-image.webp",
    product_category_id: (i % 10) + 1 // Cycling through 10 categories (1 to 10)
}));

const generateDummyProducts = () => {
    return Array.from({ length: 100 }, (v, i) => ({
        product_id: i + 1,
        product_name: `Product ${i + 1}`,
        product_price: (i + 1) * 10, // Use a fixed value for consistency
        product_image: "/img/default-product-image.webp",
        product_category_id: (i % 10) + 1 // Cycling through 10 categories (1 to 10)
    }));
};


export function OrderMenu() {

    const { setDetailProduct } = useTransactionContext();
    
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [category, setCategories] = useState([]);

    const getProducts = async () => {
        try {
            const response = await axiosInstance.get("/products/all");
            console.log("API Response", response.data);
            setProducts(response.data.data || generateDummyProducts());
        } catch (err) {
            console.error("failed to fetch products", err);
        }
    }

    useEffect (() => {
        getProducts();
    },[]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleAddProduct = (product: any) => {
        setDetailProduct({
            product_image: '/img/default-product-image.webp',
            product_name: product.product_name,
            product_price: product.product_price,
            product_id: product.id,
            product_category_id: product.product_category_id
        })
        setIsModalOpen(true);
    }

    return (
        <div className="m-4">

            <div className="flex">
                <div className="w-1/2 text-center p-4 font-bold border border-black mr-2 rounded-lg">Order</div>
                <div className="w-1/2 text-center p-4 font-bold border border-black ml-2 rounded-lg">Takeaway</div>
            </div>

            <div className="mt-4">
                <Input 
                    placeholder="Enter product name"
                />
            </div>
            
            <div>
                <CategoryProductButton 
                    productCategoryName="Category 1" 
                />
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2 overflow-y-auto max-h-[calc(70vh-4rem)]">
                
                {dummyProducts.map((product, index) => (
                    <ProductCard
                        key={index}
                        productImage={'/img/default-product-image.webp'}
                        productName={product.product_name}
                        price={product.product_price}
                        onClick={() => handleAddProduct(product)}
                    />
                ))}
                
            </div>

            {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}