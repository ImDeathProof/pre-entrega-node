const [, , method, route, ...args] = process.argv;

// validation of method and route
if (!method || !route) {
    console.error('Usage: npm run start <METHOD> <resource>[/<id>] [args...]');
    console.error('Example: npm run start GET products/15');
    process.exit(1);
}

const [resource, id] = route.split('/');

// check if the resource is valid
if (resource !== 'products') {
    console.error('Invalid resource. Only "products" is supported.');
    process.exit(1);
}

const BASE_URL = 'https://fakestoreapi.com';

const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// function to check if the id is a valid number and greater than 0
function checkId(id) {
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
        console.error('Invalid product id');
        process.exit(1);
    }
    return productId;
}

// npm run start GET products
// npm run start GET products/15
if (method === 'GET') {

    if (id) {
        // check the id
        const productId = checkId(id);

        // id valid then fetch the product
        try {
            console.log(`Fetching product with id: ${productId}`);
            const data = await request(`${BASE_URL}/${resource}/${productId}`);
            if (data) {
                console.log(data);
            } else {
                console.error(`Product with id ${productId} not found.`);
                process.exit(1);
            }
        } catch (error) {
            console.error('Error fetching product:', error.message);
            process.exit(1);
        }
    }
    else {
        try {
            console.log('Fetching all products');
            const data = await request(`${BASE_URL}/${resource}`);
            console.log(data);
        } catch (error) {
            console.error('Error fetching products:', error.message);
            process.exit(1);
        }
    }

} else if (method === 'POST') { // npm run start POST products T-Shirt-Rex 300 remeras
    if (id) {
        console.error('POST method does not support id in the route');
        process.exit(1);
    }
    const [title, price, category] = args;
    if (!title || !price || !category) {
        console.error('Please provide title, price, and category for the product');
        process.exit(1);
    }

    const productPrice = Number(price);
    if (isNaN(productPrice) || productPrice <= 0) {
        console.error('Invalid price. Please provide a valid number.');
        process.exit(1);
    }

    const productData = {
        title,
        price: productPrice,
        category
    };
    try {
        console.log('Creating product with data:', productData);
        const data = await request(`${BASE_URL}/${resource}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        console.log('Product created:', data);
    } catch (error) {
        console.error('Error creating product:', error.message);
        process.exit(1);
    }
} else if (method === 'DELETE') { // npm run start DELETE products/7
    if (id) {
        const productId = checkId(id);

        try {
            console.log(`Deleting product with id: ${productId}`);
            const data = await request(`${BASE_URL}/${resource}/${productId}`, {
                method: 'DELETE'
            });
            if (data) {
                console.log(data);
            } else {
                console.error(`Product with id ${productId} not found.`);
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
            process.exit(1);
        }

    } else {
        console.error('Please provide an id to delete a product');
        process.exit(1);
    }
} else {
    console.error('Invalid method. Please use GET, POST, or DELETE.');
    process.exit(1);
}

