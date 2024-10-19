export const getProductById = async(productId) => {
    try {
        const response = await fetch("https://www.ubaazar.com/api/product", {
            method: "POST",
            body: JSON.stringify({ productId }),
          });
        
          const { product } = await response.json();
          return product;

    } catch (error) {
        return ;
    }
}