import Image from "next/image";

function OrderList({ orders }) {
  return (
    <div className="flex flex-col gap-4 p-2 ">
      {orders?.map((value, index) => {
        return (
          <div
            key={index}
            className="text-sm text-grayColor p-4 flex flex-col gap-2 rounded-2xl border border-silver shadow-md relative"
          >
            <div className="absolute bg-brightOrange h-6 w-6 flex flex-row justify-center items-center rounded-full text-white font-semibold -top-1 -left-1">
              {index + 1}
            </div>
            <div className="flex flex-row place-content-between items-center">
              <div className="flex flex-col font-mona">
                <p className="text-darkGrayColor font-semibold text-sm">
                  Order Id
                </p>
                <p className="text-grayColor text-xs"># {value.orderNumber}</p>
              </div>
              <div className="flex flex-col font-mona">
                <p className="text-darkGrayColor font-semibold text-sm">Date</p>
                <p className="text-grayColor text-xs">
                  {formatDate(value.createdAt)}
                </p>
              </div>
              <div className="flex flex-col font-mona">
                <p className="text-darkGrayColor font-semibold text-sm">
                  Status
                </p>
                <p
                  className={`text-center font-semibold 
              ${value.status === "delivered" && "text-green"} 
              ${value.status === "ready to ship" && "text-yellowColor"} 
              ${value.status === "Shipped" && "text-yellowColor"} 
              ${value.status === "in-transit" && "text-yellowColor"} 
              ${value.status === "cancelled" && "text-red"} 
            `}
                >
                  {value.status}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-center gap-2">
              {value?.products?.map((productData, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex flex-row gap-4 items-center justify-start"
                  >
                    <div className="relative w-24 h-24">
                      <Image
                        src={productData?.product?.images?.[0]}
                        fill
                        alt={productData?.product?.productName}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="">
                      <p className="text-darkGrayColor font-semibold">
                        {productData?.product?.productName}
                      </p>
                      <p>{productData?.product?.size || "Free size"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-2 border-t border-dashed border-silver text-sm">
              <div className="flex flex-row items-center place-content-between">
                <p className="text-darkGrayColor font-mona text-xs">
                  Total amount
                </p>
                <p>₹{value.totalAmount}</p>
              </div>
              <div className="flex flex-row items-center place-content-between">
                <p className="text-darkGrayColor font-mona text-xs">
                  Payment mode
                </p>
                <p>{value.paymentMode}</p>
              </div>
              <div className="flex flex-row items-center place-content-between">
                <p className="text-darkGrayColor font-mona text-xs">
                  Payment status
                </p>
                <p>{value.paymentStatus ? "paid" : "not paid"}</p>
              </div>
            </div>
            {value.address && <div>
              <p className="text-darkGrayColor font-semibold font-mona text-sm my-1">
                Shipping address
              </p>
              <div
                className={`p-4 border flex flex-row text-left gap-4 w-full place-content-between rounded-xl shadow-md`}
              >
                <div className="text-xs">
                  <p className="text-darkBlue font-semibold text-sm">
                    {value?.address?.name}
                  </p>
                  <p>
                    {value?.address?.address} , {value?.address?.area}
                  </p>
                  <p>
                    {value?.address?.city} , {value?.address?.state} - {value?.address?.pincode}
                  </p>
                  <p>{value?.address?.mobileNumber}</p>
                </div>
              </div>
            </div>}
          </div>
        );
      })}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };

  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(",", "");
  return formattedDate;
}

export default OrderList;
