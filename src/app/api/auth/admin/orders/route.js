import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    // if (!user?.isSeller) {       
    //     return NextResponse.redirect('https://www.ubaazar.com');
    // }

    try {

        const body = await request.json();
        const { page, limit, date } = body;
        const skip = (page - 1) * limit;

        let orders = [];
        let filter = {};

        if (!page && !limit && !date) {
            return NextResponse.json({
                message: 'Missing data',
                success: false
            }, { status: 404 })
        }

        if (page && limit) {
            orders = await Order.find({}, {
                _id: 1,
                products: 1,
                address: 1,
                totalAmount: 1,
                paymentMode: 1,
                paymentStatus: 1,
                orderNumber: 1,
                status: 1,
                createdAt: 1
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)

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
        }

        else if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999)

            filter.createdAt = {
                $gte: startOfDay,
                $lt: endOfDay
            }

            orders = await Order.find(filter, {
                _id: 1,
                products: 1,
                address: 1,
                totalAmount: 1,
                paymentMode: 1,
                paymentStatus: 1,
                orderNumber: 1,
                status: 1,
                createdAt: 1
            }).populate("products address")

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
        }

        const totalOrders = await Order.countDocuments(filter)

        return NextResponse.json({
            success: true,
            orders,
            totalOrders
        })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}