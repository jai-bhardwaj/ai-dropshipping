// Woven Tails Instagram tool (our own Meta app, Instagram API with Instagram Login).
// Env (Vercel → Settings → Environment Variables, never in git):
//   IG_TOKEN    long-lived Instagram user access token
//   IG_USER_ID  the Instagram account id shown next to the token
//   CRON_SECRET random string; Vercel cron sends it, manual calls must send it too
// Calls (all need header  Authorization: Bearer <CRON_SECRET>):
//   GET  /api/social?slot=am|pm               cron: publish today's planned post(s) for that slot
//   GET  /api/social?action=me                account info
//   GET  /api/social?action=media             recent posts with like/comment counts
//   GET  /api/social?action=comments&id=MEDIA comments on a post
//   POST /api/social?action=post   {type, media[], caption}   publish now (media = site paths or full URLs)
//   POST /api/social?action=reply  {comment_id, message}
//   GET  /api/social?action=refresh           extend the token (also runs automatically on Mondays)
import { POSTS } from './_schedule.mjs';

const G = 'https://graph.instagram.com/v21.0';
const SITE = 'https://woven-tails.vercel.app/';
export const config = { maxDuration: 60 };

const url = (m) => (/^https?:/.test(m) ? m : SITE + m.replace(/^\//, ''));
const isVideo = (m) => /\.(mp4|mov)$/i.test(m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ig(path, params = {}, method = 'POST') {
  const q = new URLSearchParams({ ...params, access_token: process.env.IG_TOKEN });
  const r = await fetch(method === 'GET' ? `${G}${path}?${q}` : `${G}${path}`, method === 'GET' ? {} : { method, body: q });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`${path}: ${j.error ? j.error.message : r.status}`);
  return j;
}

async function waitReady(id, deadline) {
  while (Date.now() < deadline) {
    const s = await ig(`/${id}`, { fields: 'status_code' }, 'GET');
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`container ${id}: ${s.status_code}`);
    await sleep(3000);
  }
  throw new Error(`container ${id} still processing; try again in a minute`);
}

async function publish({ type, media, caption }) {
  const me = process.env.IG_USER_ID, deadline = Date.now() + 52000;
  let id;
  if (type === 'reel') {
    id = (await ig(`/${me}/media`, { media_type: 'REELS', video_url: url(media[0]), caption, share_to_feed: 'true' })).id;
  } else if (type === 'carousel') {
    const kids = [];
    for (const m of media.slice(0, 10)) {
      const p = isVideo(m) ? { media_type: 'VIDEO', video_url: url(m) } : { image_url: url(m) };
      kids.push((await ig(`/${me}/media`, { ...p, is_carousel_item: 'true' })).id);
    }
    for (const k of kids) await waitReady(k, deadline);
    id = (await ig(`/${me}/media`, { media_type: 'CAROUSEL', children: kids.join(','), caption })).id;
  } else {
    id = (await ig(`/${me}/media`, { image_url: url(media[0]), caption })).id;
  }
  await waitReady(id, deadline);
  const done = await ig(`/${me}/media_publish`, { creation_id: id });
  return { published: done.id, type, first: media[0] };
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'unauthorized' });
  if (!process.env.IG_TOKEN || !process.env.IG_USER_ID) return res.status(500).json({ error: 'IG_TOKEN / IG_USER_ID not set' });
  const q = new URL(req.url, 'http://x').searchParams;
  const action = q.get('action') || 'cron';
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  try {
    if (action === 'cron') {
      const now = new Date(), date = now.toISOString().slice(0, 10), slot = q.get('slot') || (now.getUTCHours() < 20 ? 'am' : 'pm');
      const due = POSTS.filter((p) => p.date === date && p.slot === slot);
      const out = [];
      for (const p of due) { try { out.push(await publish(p)); } catch (e) { out.push({ error: e.message, first: p.media[0] }); } }
      if (now.getUTCDay() === 1 && slot === 'am') { try { await ig('/refresh_access_token', { grant_type: 'ig_refresh_token' }, 'GET'); } catch (e) { out.push({ refresh_error: e.message }); } }
      console.log(JSON.stringify({ date, slot, out }));
      return res.status(200).json({ date, slot, out });
    }
    if (action === 'post') return res.status(200).json(await publish(body));
    if (action === 'me') return res.status(200).json(await ig('/me', { fields: 'user_id,username,name,followers_count,follows_count,media_count' }, 'GET'));
    if (action === 'media') return res.status(200).json(await ig(`/${process.env.IG_USER_ID}/media`, { fields: 'id,caption,media_type,permalink,timestamp,like_count,comments_count', limit: q.get('limit') || '25' }, 'GET'));
    if (action === 'comments') return res.status(200).json(await ig(`/${q.get('id')}/comments`, { fields: 'id,text,username,timestamp,replies{id,text,username,timestamp}' }, 'GET'));
    if (action === 'reply') return res.status(200).json(await ig(`/${body.comment_id}/replies`, { message: body.message }));
    if (action === 'refresh') return res.status(200).json(await ig('/refresh_access_token', { grant_type: 'ig_refresh_token' }, 'GET'));
    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}
