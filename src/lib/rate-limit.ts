type Bucket = {
  count: number;
  resetAt: number;
};

const bucketStore = new Map<string, Bucket>();

export function rateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const bucket = bucketStore.get(params.key);

  if (!bucket || now > bucket.resetAt) {
    bucketStore.set(params.key, {
      count: 1,
      resetAt: now + params.windowMs
    });
    return {
      success: true,
      remaining: params.limit - 1,
      resetAt: now + params.windowMs
    };
  }

  if (bucket.count >= params.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: bucket.resetAt
    };
  }

  bucket.count += 1;
  bucketStore.set(params.key, bucket);
  return {
    success: true,
    remaining: params.limit - bucket.count,
    resetAt: bucket.resetAt
  };
}
