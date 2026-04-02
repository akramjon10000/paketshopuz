const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3001';
const apiBaseUrl = process.env.API_URL || 'http://127.0.0.1:3002';

async function check(url, expectedStatus = 200) {
  const response = await fetch(url);
  if (response.status !== expectedStatus) {
    throw new Error(`${url} returned ${response.status}, expected ${expectedStatus}`);
  }

  return response;
}

async function main() {
  const frontendResponse = await check(frontendUrl);
  const healthResponse = await check(`${apiBaseUrl}/health`);
  const productsResponse = await check(`${apiBaseUrl}/api/products`);

  const health = await healthResponse.json();
  const products = await productsResponse.json();

  console.log(JSON.stringify({
    frontendOk: frontendResponse.ok,
    healthStatus: health.status,
    productCount: Array.isArray(products) ? products.length : 0,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
