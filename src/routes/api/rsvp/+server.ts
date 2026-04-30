import { json } from '@sveltejs/kit';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { email } = await request.json();

	if (!email || typeof email !== 'string') {
		return json({ error: 'Email is required' }, { status: 400 });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return json({ error: 'Invalid email address' }, { status: 400 });
	}

	const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblVOFPw3F10Phk8h`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			records: [{ fields: { email } }]
		})
	});

	if (!response.ok) {
		console.error('Airtable error:', await response.text());
		return json({ error: 'Failed to save RSVP' }, { status: 500 });
	}

	return json({ success: true });
};
