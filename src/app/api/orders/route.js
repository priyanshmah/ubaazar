import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {

        const reqBody = await request.json();
        const { orderIds } = reqBody;

        if (!orderIds)
            return NextResponse.json({
                message: "Order Id not found",
                success: false
            }, { status: 200 })

        const orders = await Order.find({ _id: { $in: orderIds } }).lean();
        if (!orders)
            return NextResponse.json({
                message: "Order not found",
                success: false
            }, { status: 200 });

        for (let order of orders) {

            let productIds = order?.products?.map((value) => value.product);
            let productInfo = await Product
                .find({ _id: { $in: productIds } })
                .select("_id productName price variants images")
                .lean();
                

            const address = await Address.findById(order.address).lean();

            order.address = address;
            order.products = order.products.map((productObj) => {

                let detailedProduct = productInfo.find(p => 
                    p._id.toString() === productObj.product.toString()
                );
                const variant = detailedProduct.variants?.find(
                    value => value._id.toString() === productObj.variantId.toString()
                );      
                
                

                return {...productObj, product: {
                    _id: detailedProduct?._id,
                    image: variant ? variant?.images?.at(0) : detailedProduct?.images?.at(0),
                    price: detailedProduct.price,
                    productName: detailedProduct?.productName || ''
                }};
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