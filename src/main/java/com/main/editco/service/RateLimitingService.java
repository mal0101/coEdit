package com.main.editco.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    public boolean allowRequest(String request) {
        Bucket bucket = buckets.get(request);
        return bucket.tryConsume(1);
    }
    private Bucket getBucket(String email) {
        return buckets.computeIfAbsent(email, key -> createNewBucket());
    }
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(
                5,
                Refill.intervally(5, Duration.ofMinutes(1))
        );
        return Bucket.builder()
                .addLimit(limit).build();
    }
    public long getRemainingTokens(String email) {
        Bucket bucket = getBucket(email);
        return bucket.getAvailableTokens();
    }
    public void resetLimits(String email) {
        buckets.remove(email);
    }
}
