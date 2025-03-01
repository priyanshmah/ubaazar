import axios from "axios";

export const getProductById = async(productId) => {
    try {
        const response = await fetch(`https://www.ubaazar.com/api/product`, {
            method: "POST",
            body: JSON.stringify({ productId }),
          });
        
          const { product } = await response.json();
          return product;

    } catch (error) {
        return ;
    }
}

export const getUserData = async() => {
    try {
        const response = await axios.get('/api/auth/user');
        console.log("response is: ", response.data);
        
        return response.data?.user;
        
    } catch (error) {
        return ;
    }

}

export const fetchAdminOrders = async (currentPage = 1, date) => {
    try {

      const response = await axios.post(
        "/api/auth/admin/orders",
        JSON.stringify({
          page: currentPage,
          limit: 10,
          date,
        })
      );

      console.log("orders response", response.data);
      

        return response.data.orders;
      
    } catch (error) {
        return null;
    } 
  };

  