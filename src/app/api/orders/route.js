import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();
    
    try {
        console.log("request received...");
        

        const reqBody = await request.json();
        const { orderIds } = reqBody;

        if(!orderIds)
            return NextResponse.json({
                message: "Order Id not found",
                success: false
        }, { status: 400 })

        const orders = await Order.find({ _id: { $in: orderIds }});
        
        if(!orders)
            return NextResponse.json({
                message: "Order not found",
                success: false
        }, { status: 400 })

        for (let order of orders) {

            let productIds = order?.products?.map((value) => value.product);
            let productInfo = await Product.find({ _id: { $in: productIds } }).select("_id productName images");

            const address = await Address.findById(order.address);

            order.address = address;
            order.products = order.products.map((product) => {
                const detailedProduct = productInfo.find(p => p._id.toString() === product.product.toString());
                return { ...product, product: detailedProduct };
            });

        }
       
                
        return NextResponse.json({
            message: "User data fetched successfully",
            success: true,
            orders
        }, { status: 200 })
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500 })
    }

}