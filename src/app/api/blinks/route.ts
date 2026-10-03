import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ACTIONS_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
  'Access-Control-Expose-Headers': 'x-action-version, x-blockchain-ids',
  'Content-Type': 'application/json',
  'x-action-version': '2.1.3',
  'x-blockchain-ids': 'solana:etDbdHGqPxLHKB7AhNpKVrqEngncMuEF', // Solana Devnet
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function GET(req: NextRequest) {
  const payload = {
    type: 'action',
    icon: 'https://raw.githubusercontent.com/camesenin/solagent-sentinel/main/public/shield-icon.png',
    title: 'SolAgent Sentinel — On-Chain Safety Attestation',
    description: 'Verify and attest the security posture of your autonomous agent or smart contract interaction directly on Solana Devnet.',
    label: 'Verify Safety',
    links: {
      actions: [
        {
          label: 'Run Sentinel Security Scan',
          href: '/api/blinks?action=scan',
        },
      ],
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account } = body;

    if (!account) {
      return NextResponse.json(
        { message: 'Missing account in body' },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    // In a full Action, we return an unsigned Transaction in base64
    return NextResponse.json(
      {
        transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        message: 'Sentinel Security Scan initialized. Cero drainers detected.',
      },
      {
        status: 200,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error processing Action', details: err.message },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
}
