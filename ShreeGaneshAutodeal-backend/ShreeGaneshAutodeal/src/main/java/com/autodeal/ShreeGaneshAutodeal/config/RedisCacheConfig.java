package com.autodeal.ShreeGaneshAutodeal.config;

import java.time.Duration;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@Configuration
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis", matchIfMissing = true)
public class RedisCacheConfig {

	private static final Logger log = LoggerFactory.getLogger(RedisCacheConfig.class);

	@Bean
	public RedisCacheConfiguration redisCacheConfiguration() {
		return cacheConfiguration(Duration.ofMinutes(5));
	}

	@Bean
	public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
		return RedisCacheManager.builder(redisConnectionFactory)
				.cacheDefaults(cacheConfiguration(Duration.ofMinutes(5)))
				.withInitialCacheConfigurations(
						Map.of(
						CacheNames.CATEGORIES, cacheConfiguration(Duration.ofMinutes(30)),
						CacheNames.VEHICLE_SEARCHES, cacheConfiguration(Duration.ofMinutes(2)),
						CacheNames.PUBLIC_VEHICLE_DETAILS, cacheConfiguration(Duration.ofMinutes(5)),
						CacheNames.ADMIN_VEHICLE_DETAILS, cacheConfiguration(Duration.ofMinutes(2)),
						CacheNames.VEHICLE_IMAGES, cacheConfiguration(Duration.ofMinutes(5)),
						CacheNames.VEHICLE_DOCUMENTS, cacheConfiguration(Duration.ofMinutes(5)),
						CacheNames.SALES_REPORTS, cacheConfiguration(Duration.ofMinutes(1))))
				.transactionAware()
				.build();
	}

	@Bean
	public CacheErrorHandler cacheErrorHandler() {
		return new CacheErrorHandler() {
			@Override
			public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
				log.warn("Redis cache get failed for cache '{}' and key '{}'", cache.getName(), key, exception);
			}

			@Override
			public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
				log.warn("Redis cache put failed for cache '{}' and key '{}'", cache.getName(), key, exception);
			}

			@Override
			public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
				log.warn("Redis cache evict failed for cache '{}' and key '{}'", cache.getName(), key, exception);
			}

			@Override
			public void handleCacheClearError(RuntimeException exception, Cache cache) {
				log.warn("Redis cache clear failed for cache '{}'", cache.getName(), exception);
			}
		};
	}

	private RedisCacheConfiguration cacheConfiguration(Duration ttl) {
		return RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(ttl)
				.disableCachingNullValues()
				.prefixCacheNameWith("autodeal::");
	}
}
