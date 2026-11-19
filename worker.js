export default {
  async fetch(request, env) {
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 200 || new URL(request.url).pathname !== '/video/hero-panama.mp4') {
      return asset;
    }

    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    const range = /^bytes=(\d*)-(\d*)$/i.exec(request.headers.get('Range') ?? '');
    const ifRange = request.headers.get('If-Range');
    if (request.method !== 'GET' || !range || (!range[1] && !range[2]) ||
        (ifRange && (ifRange.startsWith('W/') || ifRange !== headers.get('ETag')))) {
      return new Response(asset.body, { headers });
    }

    const video = await asset.blob();
    const start = range[1] ? Number(range[1]) : Math.max(0, video.size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), video.size - 1) : video.size - 1;
    if (start > end) {
      headers.set('Content-Range', `bytes */${video.size}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }

    headers.set('Content-Range', `bytes ${start}-${end}/${video.size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(video.slice(start, end + 1), { status: 206, headers });
  },
};
