import OrderScreen from "@/components/order/order-screen";
import axios from "axios";


export default async function OrdersPage() {
  
  const response = await axios.post(
    "https://www.ubaazar.com/api/auth/admin/orders",
    JSON.stringify({
      page: 1,
      limit: 10,
    })
  );
 
  return (
    <div className="overflow-x-hidden mb-20">
      <OrderScreen orders={response.data?.orders}/>
    </div>
  );
}
