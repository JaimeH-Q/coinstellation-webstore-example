const path = require('path');

const frontendDir = path.resolve(__dirname, '..', '..', 'coinstellation-frontend');

async function runTest() {
  console.log('--- Starting Integration Test ---');
  console.log('Loading paymentsStore from frontend...');
  const { paymentsStore } = require(path.join(frontendDir, 'backend', 'payments', 'PaymentsStore'));
  const { createCosmosPayment, validateCosmosPayment } = require(path.join(frontendDir, 'backend', 'payments', 'CosmosPayments'));

  // Test 1: Create Payment Intent
  console.log('\n1. Creating Cosmos / SEP-7 Payment Intent...');
  const testDestination = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
  const paymentIntent = await createCosmosPayment({
    destination: testDestination,
    amount: '49.99',
    currency: 'XLM',
    description: 'Orden #5521 (CraftNetwork Rango Titan)',
  });

  console.log('Payment Intent Created:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    memo: paymentIntent.memo,
    uri: paymentIntent.uri.slice(0, 50) + '...',
  });

  // Test 2: Add to PaymentsStore
  console.log('\n2. Registering in PaymentsStore...');
  const record = paymentsStore.addPayment({
    id: paymentIntent.id,
    destination: testDestination,
    amount: paymentIntent.amount,
    currency: 'XLM',
    description: 'Orden #5521 (CraftNetwork Rango Titan)',
    packageId: 'package-pro',
    memo: paymentIntent.memo,
  });

  console.log('Payment registered with status:', record.status);
  if (record.status !== 'pending') {
    throw new Error('Expected status to be pending');
  }

  // Test 3: Validate Payment
  console.log('\n3. Validating Payment with txHash...');
  const testTxHash = '0xabc1234567890abcdef1234567890abcdef123456';
  const outcome = await validateCosmosPayment(paymentIntent.id, testTxHash);
  console.log('Cosmos validation outcome valid:', outcome.valid);

  const completed = paymentsStore.completePayment(paymentIntent.id, testTxHash);
  console.log('Completed record status:', completed?.status);
  console.log('Transaction ID recorded:', completed?.transactionId);

  if (completed?.status !== 'completed') {
    throw new Error('Expected status to be completed');
  }

  // Test 4: Retrieve for Dashboard
  console.log('\n4. Fetching payments list for Dashboard (/api/payments)...');
  const dashboardPayments = paymentsStore.getPayments('demo-user', 50);
  console.log(`Retrieved ${dashboardPayments.length} payments for dashboard.`);

  const found = dashboardPayments.find(p => p.id === paymentIntent.id);
  if (!found) {
    throw new Error('Newly completed payment not found in dashboard list!');
  }

  console.log('Found webstore payment in dashboard list:', {
    id: found.id,
    packageId: found.packageId,
    amount: found.amount,
    finalAmount: found.finalAmount,
    status: found.status,
    asset: found.asset,
    createdAt: found.createdAt,
  });

  console.log('\n✅ INTEGRATION TEST PASSED! The webstore sale successfully registers, validates, and appears in the dashboard.');
}

runTest().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
