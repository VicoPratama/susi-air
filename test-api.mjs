async function testApi() {
  console.log('Testing Susi Air NestJS API endpoints...\n');

  // 1. Test Login
  const loginRes = await fetch('http://127.0.0.1:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'johndoe', password: 'susiairtest' })
  });
  const loginData = await loginRes.json();
  console.log('1. POST /auth/login -> Status:', loginRes.status);
  console.log('   Access Token received:', !!loginData.access_token);
  const token = loginData.access_token;

  const authHeaders = { Authorization: `Bearer ${token}` };

  // 2. Test Pilot Profile
  const pilotRes = await fetch('http://127.0.0.1:3001/pilot/me', { headers: authHeaders });
  const pilotData = await pilotRes.json();
  console.log('2. GET /pilot/me ->', pilotData);

  // 3. Test Flight Hours Summary
  const summaryRes = await fetch('http://127.0.0.1:3001/flight-hours/summary?range=1w', { headers: authHeaders });
  const summaryData = await summaryRes.json();
  console.log('3. GET /flight-hours/summary?range=1w ->', {
    range: summaryData.range,
    limitLine: summaryData.limitLine,
    chartYMax: summaryData.chartYMax,
    pointsCount: summaryData.points?.length,
    todayPoint: summaryData.points?.find(p => p.isToday),
    limitCards: summaryData.limitCards
  });

  // 4. Test Documents
  const docsRes = await fetch('http://127.0.0.1:3001/documents', { headers: authHeaders });
  const docsData = await docsRes.json();
  console.log('4. GET /documents -> count:', docsData.documents?.length, 'docs:', docsData.documents?.map(d => ({ label: d.label, status: d.status, daysRemaining: d.daysRemaining })));

  // 5. Test Schedules
  const schedRes = await fetch('http://127.0.0.1:3001/schedules?year=2026&month=05', { headers: authHeaders });
  const schedData = await schedRes.json();
  console.log('5. GET /schedules?year=2026&month=05 -> schedules count:', schedData.schedules?.length, 'legend count:', schedData.legend?.length);

  // 6. Test Invalid Auth Guard
  const invalidRes = await fetch('http://127.0.0.1:3001/pilot/me', {
    headers: { Authorization: 'Bearer invalid_token_123' }
  });
  console.log('6. GET /pilot/me with invalid token -> Status:', invalidRes.status, '(Expected 401)');
}

testApi().catch(console.error);
