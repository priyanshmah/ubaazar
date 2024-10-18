export const getProductById = async(productId) => {
    try {
        const response = await fetch(`${process.env.DOMAIN}/api/product`, {
            method: "POST",
            body: JSON.stringify({ productId }),
          });
        
          const { product } = await response.json();
          return product;

    } catch (error) {
        return ;
    }
}